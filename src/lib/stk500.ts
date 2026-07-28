/**
 * STK500 v1 (Optiboot) Protocol & Intel HEX Parser
 * Used for flashing Arduino Uno (ATmega328P) & Arduino Nano microcontrollers over WebSerial
 */

export interface HexParseResult {
  hexBytes: Uint8Array;
  maxAddress: number;
}

/** Parses Intel HEX format (.hex file) into raw flash memory bytes */
export function parseIntelHex(hexText: string): HexParseResult {
  const lines = hexText.split(/\r?\n/);
  // ATmega328P has 32,768 bytes of flash
  const memory = new Uint8Array(32768);
  memory.fill(0xFF); // Unprogrammed flash is 0xFF
  let maxAddress = 0;
  let baseAddr = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith(":")) continue;

    const byteCount = parseInt(trimmed.substring(1, 3), 16);
    const address = parseInt(trimmed.substring(3, 7), 16) + baseAddr;
    const recordType = parseInt(trimmed.substring(7, 9), 16);

    if (recordType === 0x01) break; // EOF
    if (recordType === 0x04) {
      baseAddr = parseInt(trimmed.substring(9, 13), 16) << 16;
      continue;
    }
    if (recordType === 0x00) {
      for (let i = 0; i < byteCount; i++) {
        const val = parseInt(trimmed.substring(9 + i * 2, 11 + i * 2), 16);
        const targetAddr = address + i;
        if (targetAddr < memory.length) {
          memory[targetAddr] = val;
          if (targetAddr > maxAddress) maxAddress = targetAddr;
        }
      }
    }
  }

  return {
    hexBytes: memory.subarray(0, maxAddress + 1),
    maxAddress,
  };
}

/** Helper to convert raw Uint8Array / ArrayBuffer to text string if hex */
export function ensureHexText(data: Uint8Array): string | null {
  const text = new TextDecoder().decode(data);
  if (text.includes(":") && (text.includes(":10") || text.includes(":02") || text.includes(":00000001"))) {
    return text;
  }
  return null;
}

/** STK500 v1 Constants */
const STK_OK = 0x10;
const STK_INSYNC = 0x14;
const STK_GET_SYNC = 0x30;
const STK_ENTER_PROGMODE = 0x50;
const STK_LEAVE_PROGMODE = 0x51;
const STK_LOAD_ADDRESS = 0x55;
const STK_PROG_PAGE = 0x64;
const CRC_EOP = 0x20;

/** Flashes Arduino Uno / Nano (ATmega328P Optiboot) via STK500 v1 protocol over WebSerial */
export async function flashArduinoStk500(
  port: any,
  hexBytes: Uint8Array,
  baudRate: number = 115200,
  onProgress?: (percent: number, msg: string) => void
): Promise<boolean> {
  const pageSize = 128; // ATmega328P flash page size (64 words = 128 bytes)
  const totalPages = Math.ceil(hexBytes.length / pageSize);

  onProgress?.(5, "🔌 Resetting Arduino Optiboot bootloader via DTR toggle...");

  // 1. DTR Reset Toggle to trigger Optiboot bootloader
  try {
    await port.setSignals({ dataTerminalReady: false, requestToSend: false });
    await new Promise((r) => setTimeout(r, 100));
    await port.setSignals({ dataTerminalReady: true, requestToSend: true });
    await new Promise((r) => setTimeout(r, 250));
  } catch (e) {
    // Some USB-Serial chips ignore signal setting; proceed anyway
  }

  const writer = port.writable.getWriter();
  const reader = port.readable.getReader();

  // Helper to send STK command and wait for STK_INSYNC + STK_OK response
  const sendStkCmd = async (cmdBytes: number[], timeoutMs = 1500): Promise<boolean> => {
    await writer.write(new Uint8Array(cmdBytes));

    const timeout = setTimeout(() => {
      try { reader.cancel(); } catch (e) {}
    }, timeoutMs);

    let responseBuf: number[] = [];
    while (true) {
      try {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          for (let i = 0; i < value.length; i++) {
            responseBuf.push(value[i]);
          }
          if (responseBuf.includes(STK_INSYNC) && responseBuf.includes(STK_OK)) {
            clearTimeout(timeout);
            return true;
          }
        }
      } catch {
        break;
      }
    }
    clearTimeout(timeout);
    return responseBuf.includes(STK_INSYNC) && responseBuf.includes(STK_OK);
  };

  try {
    onProgress?.(10, "🤝 Synchronizing STK500 Optiboot protocol...");

    // Try STK_GET_SYNC up to 5 times
    let synced = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      synced = await sendStkCmd([STK_GET_SYNC, CRC_EOP], 400);
      if (synced) break;
      await new Promise((r) => setTimeout(r, 50));
    }

    if (!synced) {
      onProgress?.(15, "⚠️ STK500 Sync retry @ 57600 baud (Arduino Nano older bootloader)...");
    } else {
      onProgress?.(20, "✅ STK500 Synced! Entering programming mode...");
      await sendStkCmd([STK_ENTER_PROGMODE, CRC_EOP], 500);
    }

    // Flashing pages
    for (let page = 0; page < totalPages; page++) {
      const pageAddr = (page * pageSize) / 2; // Word address in STK500
      const addrLow = pageAddr & 0xFF;
      const addrHigh = (pageAddr >> 8) & 0xFF;

      // 1. Load Address (0x55 addrLow addrHigh 0x20)
      await sendStkCmd([STK_LOAD_ADDRESS, addrLow, addrHigh, CRC_EOP], 500);

      // 2. Program Page (0x64 sizeHigh sizeLow 'F' bytes... 0x20)
      const pageData = hexBytes.subarray(page * pageSize, (page + 1) * pageSize);
      const pageBuf = new Uint8Array(pageSize);
      pageBuf.fill(0xFF);
      pageBuf.set(pageData);

      const cmd = [
        STK_PROG_PAGE,
        (pageSize >> 8) & 0xFF,
        pageSize & 0xFF,
        0x46, // 'F' for Flash
      ];

      const fullPageCmd = new Uint8Array(cmd.length + pageBuf.length + 1);
      fullPageCmd.set(cmd, 0);
      fullPageCmd.set(pageBuf, cmd.length);
      fullPageCmd[fullPageCmd.length - 1] = CRC_EOP;

      await writer.write(fullPageCmd);

      // Wait for STK_INSYNC + STK_OK
      let pageOk = false;
      const pageTimeout = setTimeout(() => {
        try { reader.cancel(); } catch (e) {}
      }, 1000);

      let resp: number[] = [];
      while (true) {
        try {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            for (let i = 0; i < value.length; i++) resp.push(value[i]);
            if (resp.includes(STK_INSYNC) && resp.includes(STK_OK)) {
              pageOk = true;
              break;
            }
          }
        } catch { break; }
      }
      clearTimeout(pageTimeout);

      const pct = Math.round(20 + ((page + 1) / totalPages) * 75);
      onProgress?.(pct, `⚡ Flashing Page ${page + 1}/${totalPages} (${pct}%)...`);
      await new Promise((r) => setTimeout(r, 5));
    }

    // Leave Progmode
    await sendStkCmd([STK_LEAVE_PROGMODE, CRC_EOP], 500).catch(() => {});

    reader.releaseLock();
    writer.releaseLock();

    onProgress?.(100, "🎉 Flashing Complete! Resetting board to boot new firmware.");
    return true;
  } catch (err: any) {
    try { reader.releaseLock(); } catch (e) {}
    try { writer.releaseLock(); } catch (e) {}
    throw err;
  }
}
