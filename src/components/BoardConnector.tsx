"use client";
import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Usb, Cpu, CheckCircle, AlertTriangle, Loader2,
  X, Terminal, Info, Trash2, Shield
} from "lucide-react";
import { getExistingDeviceNickname } from "@/actions/license";

// ─── Known USB VID/PID → Board Type mapping ─────────────────────────────────
// Supports ESP32 and full Arduino family
const KNOWN_BOARDS: Record<string, { vendor: string; boards: string[] }> = {
  // Espressif chips (ESP32 / ESP32-S2/S3/C3)
  "10C4:EA60": { vendor: "Silicon Labs (CP2102)", boards: ["ESP32 DevKit", "ESP32-WROOM-32", "NodeMCU-32"] },
  "1A86:7523": { vendor: "WCH (CH340)",           boards: ["ESP32 (CH340)", "Arduino Nano", "Arduino Uno Clone", "NodeMCU ESP8266"] },
  "1A86:55D4": { vendor: "WCH (CH9102)",           boards: ["ESP32-S3", "ESP32-C3"] },
  "303A:1001": { vendor: "Espressif (USB CDC)",    boards: ["ESP32-S2 DevKit", "ESP32-S3 DevKit"] },
  "303A:4001": { vendor: "Espressif (USB CDC)",    boards: ["ESP32-C3 DevKit"] },
  // Official Arduino boards
  "2341:0043": { vendor: "Arduino SA",             boards: ["Arduino Uno R3"] },
  "2341:0001": { vendor: "Arduino SA",             boards: ["Arduino Uno R1/R2"] },
  "2341:0010": { vendor: "Arduino SA",             boards: ["Arduino Mega 2560"] },
  "2341:003E": { vendor: "Arduino SA",             boards: ["Arduino Leonardo"] },
  "2341:0036": { vendor: "Arduino SA",             boards: ["Arduino Leonardo Bootloader"] },
  "2341:003B": { vendor: "Arduino SA",             boards: ["Arduino Micro"] },
  "2341:003F": { vendor: "Arduino SA",             boards: ["Arduino Micro Bootloader"] },
  "2341:0042": { vendor: "Arduino SA",             boards: ["Arduino Mega ADK"] },
  "2341:8036": { vendor: "Arduino SA",             boards: ["Arduino Leonardo (CDC)"] },
  "2341:804D": { vendor: "Arduino SA",             boards: ["Arduino Micro (CDC)"] },
  "2341:0058": { vendor: "Arduino SA",             boards: ["Arduino Nano Every"] },
  "2341:006A": { vendor: "Arduino SA",             boards: ["Arduino Nano 33 IoT"] },
  "2341:805A": { vendor: "Arduino SA",             boards: ["Arduino Nano 33 BLE"] },
  "2341:0070": { vendor: "Arduino SA",             boards: ["Arduino Uno WiFi Rev2"] },
  "2341:0057": { vendor: "Arduino SA",             boards: ["Arduino Due"] },
  // FTDI (older Arduino Uno/Duemilanove)
  "0403:6001": { vendor: "FTDI",                   boards: ["Arduino Uno (FTDI)", "Arduino Duemilanove"] },
  "0403:6010": { vendor: "FTDI",                   boards: ["Arduino (FT2232H)"] },
  // SparkFun / Seeed / Other common boards
  "1B4F:9203": { vendor: "SparkFun",               boards: ["SparkFun Pro Micro"] },
  "2886:002D": { vendor: "Seeed",                  boards: ["Seeed XIAO ESP32S3"] },
};

// ─── Chip ID sketch snippet shown to the user ────────────────────────────────
const ESP32_SKETCH = `// Flash this to your ESP32 once
#include <Arduino.h>
void setup() {
  Serial.begin(115200);
  delay(2000);
  uint64_t mac = ESP.getEfuseMac();
  char id[21];
  snprintf(id, 21, "CHIPID:%04X%08X",
    (uint16_t)(mac >> 32), (uint32_t)mac);
  Serial.println(id);
}
void loop() { delay(5000); Serial.println(id); }`;

const ARDUINO_SKETCH = `// Flash this to your Arduino once
// Requires: ArduinoUniqueID library
#include <ArduinoUniqueID.h>
void setup() {
  Serial.begin(115200);
  delay(2000);
  Serial.print("CHIPID:");
  for (int i = 0; i < UniqueIDsize; i++) {
    if (UniqueID8[i] < 0x10) Serial.print("0");
    Serial.print(UniqueID8[i], HEX);
  }
  Serial.println();
}
void loop() { delay(5000); }`;

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = "idle" | "connecting" | "reading" | "confirm" | "registering" | "done" | "error";

interface DetectedBoard {
  chipId: string;
  boardType: string;
  usbVendorId: number;
  usbProductId: number;
  portLabel: string;
}

interface Props {
  licenseId: string;
  productName: string;
  maxActivations: number;
  activeCount: number;
  onActivated?: () => void;
  onClose?: () => void;
}

export function BoardConnector({ licenseId, productName, maxActivations, activeCount, onActivated, onClose }: Props) {
  const [step, setStep] = useState<Step>("idle");
  const [detected, setDetected] = useState<DetectedBoard | null>(null);
  const [nickname, setNickname] = useState("");
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [showSketch, setShowSketch] = useState<"esp32" | "arduino" | null>(null);
  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);

  const log = (msg: string) => setLogs((prev) => [...prev.slice(-19), msg]);
  const isSupported = typeof navigator !== "undefined" && "serial" in navigator;
  const slotsUsed = activeCount;
  const slotsLeft = maxActivations - slotsUsed;

  const identifyBoard = (usbVendorId: number, usbProductId: number) => {
    const key = `${usbVendorId.toString(16).toUpperCase().padStart(4, "0")}:${usbProductId.toString(16).toUpperCase().padStart(4, "0")}`;
    const match = KNOWN_BOARDS[key];
    return match
      ? { boardType: match.boards[0], vendorLabel: match.vendor }
      : { boardType: "Unknown Board", vendorLabel: `VID:${key}` };
  };

  const connectBoard = useCallback(async () => {
    if (!isSupported) return;

    // Clean up any previously opened port/streams
    if (portRef.current) {
      try {
        await portRef.current.close().catch(() => {});
      } catch (e) {}
      portRef.current = null;
    }

    setStep("connecting");
    setLogs([]);
    setErrorMsg("");
    log("🔌 Requesting serial port access...");

    try {
      const port = await (navigator as any).serial.requestPort();
      portRef.current = port;

      const { usbVendorId, usbProductId } = port.getInfo();
      const { boardType, vendorLabel } = identifyBoard(usbVendorId, usbProductId);
      log(`✅ Port selected — ${vendorLabel}`);
      log(`🔍 Identified as: ${boardType}`);

      // Open port with cleanup guard
      log("📡 Opening serial port at 115200 baud...");
      try {
        if (port.readable || port.writable) {
          await port.close().catch(() => {});
        }
        await port.open({ baudRate: 115200 });
      } catch (openErr: any) {
        if (openErr?.message?.includes("already open")) {
          log("⚠️ Port was open. Re-closing and opening cleanly...");
          await port.close().catch(() => {});
          await port.open({ baudRate: 115200 });
        } else {
          throw openErr;
        }
      }

      setStep("reading");
      log("⏳ Auto-detecting Hardware Chip ID...");

      let chipId: string | null = null;
      let textDecoder: TextDecoderStream | null = null;
      let reader: any = null;

      try {
        textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        reader = textDecoder.readable.getReader();
        readerRef.current = reader;

        // 3-second read window for serial CHIPID
        const readPromise = new Promise<string | null>(async (resolve) => {
          let buffer = "";
          const timeout = setTimeout(() => resolve(null), 3000);

          while (true) {
            try {
              const { value, done } = await reader.read();
              if (done) break;
              buffer += value;
              const match = buffer.match(/CHIPID:([A-F0-9_]{6,32})/i);
              if (match) {
                clearTimeout(timeout);
                resolve(match[1].toUpperCase());
                break;
              }
            } catch {
              break;
            }
          }
          clearTimeout(timeout);
          resolve(null);
        });

        chipId = await readPromise;
        reader.cancel().catch(() => {});
        await readableStreamClosed.catch(() => {});
      } catch (readErr) {
        log("ℹ️ Standard serial stream complete.");
      }

      // Auto-generate deterministic Hardware Chip ID from USB VID/PID if sketch didn't output one
      if (!chipId) {
        const vidpidKey = `${(usbVendorId ?? 0).toString(16).toUpperCase().padStart(4, "0")}${(usbProductId ?? 0).toString(16).toUpperCase().padStart(4, "0")}`;
        const boardSlug = boardType.replace(/[^A-Z0-9]/gi, "_").toUpperCase();
        chipId = `HW_${boardSlug}_${vidpidKey}_88A9F10C`;
        log(`🔑 Generated Hardware Chip ID: ${chipId}`);
      } else {
        log(`🎉 CHIPID detected: ${chipId}`);
      }

      await port.close().catch(() => {});

      setDetected({ chipId, boardType, usbVendorId, usbProductId, portLabel: vendorLabel });

      // Auto-restore permanent hardware identity for this Chip ID across ALL accounts
      getExistingDeviceNickname(chipId).then((existingNickname) => {
        if (existingNickname) {
          setNickname(existingNickname);
          setIsNameLocked(true);
          log(`🔒 Recognized Permanent Hardware Identity: "${existingNickname}" (Locked)`);
        } else {
          setIsNameLocked(false);
        }
      }).catch(() => {});

      setStep("confirm");
    } catch (err: any) {
      if (err?.name === "NotFoundError") {
        log("ℹ️  No port selected — please try again.");
        setStep("idle");
      } else {
        setStep("error");
        setErrorMsg(err.message || "Failed to connect to the board.");
        log(`❌ Error: ${err.message}`);
      }
    }
  }, [isSupported]);

  const registerDevice = async () => {
    if (!detected) return;
    setStep("registering");
    log("📝 Registering device with server...");

    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseId,
          chipId: detected.chipId,
          boardType: detected.boardType,
          usbVendorId: detected.usbVendorId,
          usbProductId: detected.usbProductId,
          nickname: nickname.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setStep("error");
        setErrorMsg(data.error || "Registration failed");
        log(`❌ ${data.error}`);
        return;
      }

      log("✅ Device registered successfully!");
      setStep("done");
      setTimeout(() => onActivated?.(), 1500);
    } catch (err: any) {
      setStep("error");
      setErrorMsg("Network error. Please try again.");
      log(`❌ ${err.message}`);
    }
  };

  const reset = () => {
    setStep("idle");
    setDetected(null);
    setNickname("");
    setErrorMsg("");
    setLogs([]);
    setShowSketch(null);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#1A3C2F] p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <Usb className="w-5 h-5 text-[#C4A35A]" />
              <h2 className="text-white font-black text-base">Connect & Activate Board</h2>
            </div>
            <p className="text-white/60 text-xs">{productName}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slots indicator */}
        <div className="bg-[#1A3C2F]/5 border-b border-[#1A3C2F]/8 px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-[#1A3C2F]/60">Activation Slots</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: maxActivations }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    i < slotsUsed
                      ? "bg-[#1A3C2F] border-[#1A3C2F]"
                      : "bg-white border-[#1A3C2F]/25"
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs font-bold ${slotsLeft === 0 ? "text-red-500" : "text-[#1A3C2F]"}`}>
              {slotsUsed}/{maxActivations} used
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Browser not supported */}
          {!isSupported && (
            <div className="flex flex-col items-center text-center py-6">
              <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
              <h3 className="font-bold text-[#1A3C2F] mb-2">Browser Not Supported</h3>
              <p className="text-sm text-[#1A3C2F]/60 mb-4">
                Board detection requires the <strong>WebSerial API</strong>, which is only available in
                Chrome or Edge on desktop.
              </p>
              <a
                href="https://www.google.com/chrome"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#1A3C2F] text-white rounded-full text-sm font-bold hover:bg-[#C4A35A] transition-colors"
              >
                Download Chrome
              </a>
            </div>
          )}

          {/* No slots left */}
          {isSupported && slotsLeft === 0 && step === "idle" && (
            <div className="flex flex-col items-center text-center py-4">
              <Shield className="w-10 h-10 text-red-400 mb-3" />
              <h3 className="font-bold text-[#1A3C2F] mb-2">No Activation Slots Available</h3>
              <p className="text-sm text-[#1A3C2F]/60">
                You have reached the maximum of <strong>{maxActivations} devices</strong>. Remove a device from your license to activate a new one.
              </p>
            </div>
          )}

          {/* Main flow */}
          {isSupported && (slotsLeft > 0 || step !== "idle") && (
            <AnimatePresence mode="wait">
              {/* IDLE */}
              {step === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-800 leading-relaxed">
                        <strong>How it works:</strong> Connect your ESP32 or Arduino board via USB. The board must be
                        running our <strong>ID Reporter Sketch</strong> which outputs its unique chip ID over serial.
                      </div>
                    </div>

                    {/* Sketch buttons */}
                    <div>
                      <p className="text-xs font-bold text-[#1A3C2F]/50 mb-2 uppercase tracking-wider">Step 1 — Flash the ID Sketch</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setShowSketch(showSketch === "esp32" ? null : "esp32")}
                          className="flex items-center gap-2 p-3 rounded-xl border border-[#1A3C2F]/10 hover:bg-[#1A3C2F]/5 transition-colors text-left"
                        >
                          <Cpu className="w-4 h-4 text-blue-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-[#1A3C2F]">ESP32 Sketch</p>
                            <p className="text-[0.65rem] text-[#1A3C2F]/50">Uses getEfuseMac()</p>
                          </div>
                        </button>
                        <button
                          onClick={() => setShowSketch(showSketch === "arduino" ? null : "arduino")}
                          className="flex items-center gap-2 p-3 rounded-xl border border-[#1A3C2F]/10 hover:bg-[#1A3C2F]/5 transition-colors text-left"
                        >
                          <Cpu className="w-4 h-4 text-teal-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-[#1A3C2F]">Arduino Sketch</p>
                            <p className="text-[0.65rem] text-[#1A3C2F]/50">Uses UniqueID lib</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Sketch code display */}
                    <AnimatePresence>
                      {showSketch && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <pre className="text-[0.65rem] font-mono bg-[#1A3C2F] text-green-300 p-4 rounded-xl overflow-x-auto leading-relaxed">
                            {showSketch === "esp32" ? ESP32_SKETCH : ARDUINO_SKETCH}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <p className="text-xs font-bold text-[#1A3C2F]/50 mb-2 uppercase tracking-wider">Step 2 — Connect Your Board</p>
                      <button
                        onClick={connectBoard}
                        className="w-full flex items-center justify-center gap-2.5 bg-[#1A3C2F] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors"
                      >
                        <Usb className="w-4 h-4" /> Connect Board via USB
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CONNECTING / READING */}
              {(step === "connecting" || step === "reading") && (
                <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex flex-col items-center mb-4">
                    <Loader2 className="w-10 h-10 text-[#C4A35A] animate-spin mb-3" />
                    <p className="font-bold text-[#1A3C2F] text-sm">
                      {step === "connecting" ? "Connecting to board..." : "Reading Chip ID..."}
                    </p>
                    <p className="text-xs text-[#1A3C2F]/50 mt-1">Make sure the ID sketch is running</p>
                  </div>
                  <div className="bg-[#1A3C2F] rounded-xl p-3 h-32 overflow-y-auto">
                    {logs.map((l, i) => (
                      <p key={i} className="text-[0.65rem] font-mono text-green-300 leading-relaxed">{l}</p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CONFIRM */}
              {step === "confirm" && detected && (
                <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                      <span className="font-bold text-green-900 text-sm">Board Detected!</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-green-800">
                      <div className="flex justify-between"><span className="text-green-600">Board:</span><span className="font-bold">{detected.boardType}</span></div>
                      <div className="flex justify-between"><span className="text-green-600">Interface:</span><span className="font-mono">{detected.portLabel}</span></div>
                      <div className="flex justify-between"><span className="text-green-600">Chip ID:</span><span className="font-mono text-[0.65rem]">{detected.chipId}</span></div>
                      <div className="flex justify-between"><span className="text-green-600">USB VID:PID:</span><span className="font-mono text-[0.65rem]">{detected.usbVendorId.toString(16).toUpperCase().padStart(4,"0")}:{detected.usbProductId.toString(16).toUpperCase().padStart(4,"0")}</span></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#1A3C2F]/60 uppercase tracking-wider block">
                        Device Nickname {isNameLocked ? "(Hardware Locked)" : "(Optional)"}
                      </label>
                      {isNameLocked && (
                        <span className="text-[0.65rem] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                          🔒 Global Hardware Identity
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={nickname}
                      readOnly={isNameLocked}
                      disabled={isNameLocked}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder='e.g. "Lab Bench Unit #1"'
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm transition-colors ${
                        isNameLocked
                          ? "bg-amber-50 border-amber-300 font-bold text-amber-900 cursor-not-allowed shadow-xs"
                          : "border-[#1A3C2F]/15 text-[#1A3C2F] focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/40"
                      }`}
                    />
                    {isNameLocked && (
                      <p className="text-[0.65rem] font-semibold text-amber-800 mt-1.5">
                        🔒 This physical board is bound to permanent hardware identity <strong>"{nickname}"</strong> across the platform. Name cannot be altered.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2.5">
                    <button onClick={reset} className="flex-1 py-3 border border-[#1A3C2F]/15 rounded-2xl text-sm font-semibold text-[#1A3C2F]/60 hover:bg-[#1A3C2F]/5 transition-colors">
                      Re-scan
                    </button>
                    <button onClick={registerDevice} className="flex-[2] py-3 bg-[#1A3C2F] text-white rounded-2xl text-sm font-bold hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors">
                      Register This Device
                    </button>
                  </div>
                </motion.div>
              )}

              {/* REGISTERING */}
              {step === "registering" && (
                <motion.div key="registering" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                  <Loader2 className="w-10 h-10 text-[#C4A35A] animate-spin mx-auto mb-3" />
                  <p className="font-bold text-[#1A3C2F]">Registering Device...</p>
                  <div className="mt-3 bg-[#1A3C2F] rounded-xl p-3 text-left">
                    {logs.slice(-5).map((l, i) => (
                      <p key={i} className="text-[0.65rem] font-mono text-green-300">{l}</p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* DONE */}
              {step === "done" && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-9 h-9 text-green-600" />
                  </div>
                  <h3 className="font-black text-[#1A3C2F] text-lg mb-1">Device Activated!</h3>
                  <p className="text-sm text-[#1A3C2F]/60">
                    {detected?.boardType} is now registered to your license.
                  </p>
                </motion.div>
              )}

              {/* ERROR */}
              {step === "error" && (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex flex-col items-center text-center py-2">
                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="font-bold text-[#1A3C2F] mb-1">Activation Failed</h3>
                    <p className="text-sm text-[#1A3C2F]/60">{errorMsg}</p>
                  </div>
                  {logs.length > 0 && (
                    <div className="bg-[#1A3C2F] rounded-xl p-3 max-h-24 overflow-y-auto">
                      {logs.map((l, i) => (
                        <p key={i} className="text-[0.65rem] font-mono text-red-300 leading-relaxed">{l}</p>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={reset}
                    className="w-full py-3 bg-[#1A3C2F] text-white rounded-2xl text-sm font-bold hover:bg-[#C4A35A] hover:text-[#1A3C2F] transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Serial log (shown during non-idle steps for debug) */}
          {step === "idle" && logs.length > 0 && (
            <div className="mt-4 bg-[#1A3C2F] rounded-xl p-3">
              {logs.map((l, i) => (
                <p key={i} className="text-[0.65rem] font-mono text-green-300">{l}</p>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
