import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seed...");

  // Delete in FK-safe order
  await prisma.review.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.license.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});

  const products = [
    {
      title: "IoT Weather Station (ESP32)",
      slug: "iot-weather-station",
      description:
        "Complete blueprint and source code for building a Wi-Fi connected weather station using the ESP32 and BME280 sensor. Features an OLED display and a responsive web dashboard to monitor temperature, humidity, and pressure remotely. The firmware uses async web server patterns for low-latency data delivery and persistent NVS storage for Wi-Fi credentials.",
      shortDescription: "Build a Wi-Fi connected weather station with ESP32 & BME280.",
      price: 299,
      category: "ESP32",
      difficulty: "BEGINNER",
      tags: ["IoT", "Sensors", "Wi-Fi", "OLED", "Weather", "Dashboard"],
      version: "v1.2.0",
      lastUpdated: new Date("2025-06-10"),
      downloadCount: 1247,
      rating: 4.7,
      reviewCount: 89,
      features: [
        "Real-time temperature, humidity & pressure monitoring",
        "Built-in async web server dashboard",
        "OLED display with auto-refresh",
        "NVS-based Wi-Fi credential persistence",
        "JSON REST API for sensor data",
        "Over-The-Air (OTA) firmware update support",
      ],
      compatibleBoards: ["ESP32 DevKit V1", "ESP32-WROOM-32", "NodeMCU ESP32"],
      faqs: [
        { question: "Do I need any prior ESP32 experience?", answer: "No! This project is designed for complete beginners. The setup guide walks you through every step from IDE installation to first boot." },
        { question: "Can I add more sensors?", answer: "Yes, the code is modular. We include documentation on adding DS18B20, MQ135, and other I2C/SPI sensors." },
        { question: "Does it work without the OLED?", answer: "Absolutely. The OLED is optional — the web dashboard works independently." },
      ],
      hardwareUsed: ["ESP32 Dev Board", "BME280 Sensor", "0.96 inch OLED (SSD1306)", "Jumper Wires", "Breadboard", "Micro USB Cable"],
      softwareUsed: ["Arduino IDE 2.x", "C++", "ESPAsyncWebServer", "ArduinoJson", "HTML/CSS/JS"],
      whatsIncluded: ["Full C++ Source Code", "Wiring Schematic (Fritzing + PDF)", "Step-by-step Setup Guide", "BOM (Bill of Materials)", "Web Dashboard HTML/CSS/JS"],
      safetyWarning: "Ensure correct voltage logic (3.3V) when wiring the BME280 sensor. Do not apply 5V directly to the sensor.",
      versionHistory: [
        { version: "v1.2.0", date: "2025-06-10", notes: "Added OTA update support and improved Wi-Fi reconnection logic." },
        { version: "v1.1.0", date: "2025-02-15", notes: "Rewrote web dashboard with real-time charts." },
        { version: "v1.0.0", date: "2024-11-01", notes: "Initial release." },
      ],
      images: [],
      pcbPreviewImage: null,
      cadPreviewImage: null,
      videoUrl: null,
    },
    {
      title: "6-DOF Robotic Arm Controller",
      slug: "6-dof-robotic-arm",
      description:
        "Advanced embedded C++ code and custom PCB schematic for controlling a 6-Degree-of-Freedom robotic arm. Implements a full inverse kinematics solver and smooth trajectory planning using an Arduino Mega and PCA9685 PWM driver. Includes a Python-based desktop controller with joystick and pre-programmed sequence support.",
      shortDescription: "Advanced control system for 6-axis robotic arms with inverse kinematics.",
      price: 899,
      category: "ARDUINO",
      difficulty: "ADVANCED",
      tags: ["Robotics", "IK Solver", "PCB", "Servo", "6-DOF", "Python"],
      version: "v2.1.0",
      lastUpdated: new Date("2025-07-01"),
      downloadCount: 543,
      rating: 4.9,
      reviewCount: 47,
      features: [
        "Full 6-DOF inverse kinematics solver",
        "Smooth trajectory planning with acceleration curves",
        "Custom PCB with PCA9685 servo driver",
        "Python desktop controller GUI",
        "Pre-programmed motion sequences",
        "Serial command protocol documentation",
      ],
      compatibleBoards: ["Arduino Mega 2560", "Arduino Uno (limited axes)"],
      faqs: [
        { question: "What servos are compatible?", answer: "The firmware is tuned for MG996R servos. Any standard PWM servo in the 4.8V–6V range can be adapted with minor angle calibration." },
        { question: "Can I use a different MCU?", answer: "The IK solver logic is portable. A porting guide for STM32 and ESP32 is included in the documentation." },
        { question: "Is the PCB ready for manufacturing?", answer: "Yes. Gerber files are included and have been validated with JLCPCB design rules." },
      ],
      hardwareUsed: ["Arduino Mega 2560", "PCA9685 16-Channel PWM", "6x MG996R Servos", "Custom PCB", "12V 5A Power Supply"],
      softwareUsed: ["PlatformIO", "C++", "Python 3.x", "Tkinter (GUI)"],
      whatsIncluded: ["Firmware Source Code (C++)", "Eagle PCB Schematic & Board files", "Gerber Files (JLCPCB ready)", "Inverse Kinematics Python Script", "CAD Models for Arm Brackets (STL)", "Python GUI Controller"],
      safetyWarning: "Use a dedicated 5V 10A power supply for the servos. Do not power servos from the Arduino USB port — this will damage the board.",
      versionHistory: [
        { version: "v2.1.0", date: "2025-07-01", notes: "Added Python GUI controller and pre-programmed sequences." },
        { version: "v2.0.0", date: "2025-03-20", notes: "Migrated to PlatformIO, added custom PCB design files." },
        { version: "v1.0.0", date: "2024-09-15", notes: "Initial release with basic servo control." },
      ],
      images: [],
      pcbPreviewImage: null,
      cadPreviewImage: null,
      videoUrl: null,
    },
    {
      title: "Smart Home Automation Hub (Raspberry Pi)",
      slug: "smart-home-hub",
      description:
        "Transform your Raspberry Pi into a powerful, privacy-first local smart home hub. Features a custom Node.js backend and React dashboard to control relay modules, read MQTT sensors, and automate schedules — entirely offline without cloud dependency. Supports Home Assistant integration via MQTT bridge.",
      shortDescription: "Local-only smart home automation hub for Raspberry Pi.",
      price: 1499,
      category: "RASPBERRY_PI",
      difficulty: "INTERMEDIATE",
      tags: ["Smart Home", "MQTT", "Node.js", "React", "Relay", "Docker", "IoT"],
      version: "v1.3.0",
      lastUpdated: new Date("2025-05-20"),
      downloadCount: 892,
      rating: 4.5,
      reviewCount: 134,
      features: [
        "100% local — no cloud dependency",
        "React dashboard with real-time sensor updates",
        "MQTT broker integration (Mosquitto)",
        "Schedule-based automation engine",
        "4-channel relay control with safety lockouts",
        "Home Assistant bridge via MQTT",
        "Dockerized deployment for easy setup",
      ],
      compatibleBoards: ["Raspberry Pi 4 (2GB/4GB/8GB)", "Raspberry Pi 3B+"],
      faqs: [
        { question: "Does this require internet access?", answer: "No. Everything runs entirely on your local network. The Raspberry Pi never connects to any external server." },
        { question: "Can I add more relay channels?", answer: "Yes. The code supports up to 16 channels via I2C GPIO expanders. Documentation included." },
        { question: "Is Docker required?", answer: "Docker is recommended but not required. A manual setup guide with systemd service files is also included." },
      ],
      hardwareUsed: ["Raspberry Pi 4", "4-Channel 5V Relay Module", "DHT22 Temperature/Humidity Sensor", "5V 3A USB-C Power Supply"],
      softwareUsed: ["Node.js 20", "React 18", "Mosquitto (MQTT)", "Docker & Docker Compose", "SQLite"],
      whatsIncluded: ["Node.js Backend Source Code", "React Dashboard Source Code", "Docker Compose Configuration", "Wiring Diagram (PDF)", "Systemd Service Files", "Setup & Configuration Guide"],
      safetyWarning: "EXTREME CAUTION: Never connect mains voltage (220V/110V AC) to relay modules without proper electrical safety knowledge. Incorrect wiring is lethal. Use only low-voltage DC loads if you are not a qualified electrician.",
      versionHistory: [
        { version: "v1.3.0", date: "2025-05-20", notes: "Added schedule automation engine and Home Assistant MQTT bridge." },
        { version: "v1.2.0", date: "2025-01-10", notes: "Migrated frontend to React 18, added dark mode." },
        { version: "v1.0.0", date: "2024-08-01", notes: "Initial release." },
      ],
      images: [],
      pcbPreviewImage: null,
      cadPreviewImage: null,
      videoUrl: null,
    },
    {
      title: "Custom Mechanical Keyboard PCB (65%)",
      slug: "custom-keyboard-pcb-65",
      description:
        "Production-ready KiCad 7 files for a 65% layout mechanical keyboard with hot-swappable Kailh sockets. Features per-key RGB using SK6812MINI-E LEDs and an RP2040 microcontroller with QMK firmware. All Gerber files are validated with JLCPCB design rules and are ready to send for manufacturing.",
      shortDescription: "Production-ready KiCad PCB files for a 65% mechanical keyboard with RP2040 & RGB.",
      price: 1999,
      category: "PCB_DESIGN",
      difficulty: "EXPERT",
      tags: ["PCB", "Keyboard", "KiCad", "RP2040", "RGB", "QMK", "Gerber"],
      version: "v1.2.0",
      lastUpdated: new Date("2025-04-15"),
      downloadCount: 321,
      rating: 4.8,
      reviewCount: 28,
      features: [
        "65% layout (68 keys) with arrow cluster",
        "Hot-swappable Kailh MX socket footprints",
        "Per-key RGB with SK6812MINI-E LEDs",
        "RP2040 dual-core ARM Cortex-M0+ MCU",
        "USB-C with ESD protection",
        "QMK firmware with VIA support",
        "JLCPCB-validated Gerber files",
      ],
      compatibleBoards: ["RP2040 (onboard)"],
      faqs: [
        { question: "Can I order this PCB directly from JLCPCB?", answer: "Yes. The included Gerbers are pre-validated. Simply upload the .zip to JLCPCB with default PCB settings (1.6mm, HASL, green)." },
        { question: "Is the firmware configurable?", answer: "Fully. The QMK source is included and supports VIA for real-time keymap editing without reflashing." },
        { question: "What switches are compatible?", answer: "Any standard MX-footprint switches. Cherry MX, Gateron, Kailh Box, and equivalents all work." },
      ],
      hardwareUsed: ["RP2040 MCU", "Kailh Hot-Swap Sockets (68x)", "SK6812MINI-E RGB LEDs (68x)", "USB-C Connector", "ESD Protection ICs"],
      softwareUsed: ["KiCad 7", "QMK Firmware", "VIA Configurator"],
      whatsIncluded: ["KiCad Schematic (.kicad_sch)", "KiCad PCB Layout (.kicad_pcb)", "Gerber Files (JLCPCB ready .zip)", "BOM (Excel & CSV)", "QMK Firmware Source", "Build & Flash Guide"],
      safetyWarning: "Requires advanced SMD soldering skills (0402 components, QFN packages). A hot-air rework station is recommended for SK6812MINI-E LED placement.",
      versionHistory: [
        { version: "v1.2.0", date: "2025-04-15", notes: "Fixed trace routing near USB-C port; improved structural integrity." },
        { version: "v1.1.0", date: "2025-01-20", notes: "Added VIA firmware support and ESD protection circuit." },
        { version: "v1.0.0", date: "2024-10-05", notes: "Initial release." },
      ],
      images: [],
      pcbPreviewImage: null,
      cadPreviewImage: null,
      videoUrl: null,
    },
    {
      title: "STM32 Motor Controller Board",
      slug: "stm32-motor-controller",
      description:
        "High-performance BLDC motor controller design based on the STM32F4 series microcontroller. Implements a full Field Oriented Control (FOC) algorithm in C with configurable PID loops. Designed for robotics and EV prototyping with DRV8323 gate driver, hall-effect sensor support, and UART/CAN telemetry.",
      shortDescription: "BLDC motor controller with FOC firmware for STM32F4 — robotics and EV ready.",
      price: 2499,
      category: "STM32",
      difficulty: "EXPERT",
      tags: ["Motor Control", "BLDC", "FOC", "STM32", "Robotics", "EV", "PCB", "CAN Bus"],
      version: "v2.0.0",
      lastUpdated: new Date("2025-07-10"),
      downloadCount: 189,
      rating: 4.9,
      reviewCount: 22,
      features: [
        "Full Field Oriented Control (FOC) algorithm",
        "Configurable PID loops for speed, current, and position",
        "DRV8323 gate driver integration",
        "Hall-effect and encoder sensor support",
        "UART and CAN bus telemetry",
        "Protection: OCP, OVP, UVP, thermal shutdown",
        "STM32CubeIDE HAL-based firmware",
      ],
      compatibleBoards: ["STM32F405RGT6", "STM32F407VGT6"],
      faqs: [
        { question: "What BLDC motors can this drive?", answer: "Supports 3-phase BLDC motors from 24V to 48V, up to 20A continuous. Motor tuning guide is included." },
        { question: "Is CAN bus required?", answer: "No. CAN bus is optional for multi-axis systems. UART telemetry works standalone." },
        { question: "Are the PCB files included?", answer: "PDF schematics are included. Full Altium Designer source files are available in the EXPERT tier. Gerber files will be available in a future update." },
      ],
      hardwareUsed: ["STM32F405RGT6", "DRV8323RS Gate Driver", "N-Channel MOSFETs (6x)", "Hall-Effect Sensor", "CAN Transceiver (TJA1051)"],
      softwareUsed: ["STM32CubeIDE", "C (HAL)", "STM32 Motor Control SDK (reference)"],
      whatsIncluded: ["C Firmware Source (STM32CubeIDE project)", "PDF Schematic", "BOM (Excel)", "Tuning & Configuration Guide", "UART/CAN Protocol Documentation"],
      safetyWarning: "High current application — up to 20A at 48V. Mandatory: proper heatsinking for MOSFETs, appropriately rated wiring, and safety fuses. Do not operate without current protection configured.",
      versionHistory: [
        { version: "v2.0.0", date: "2025-07-10", notes: "Added CAN bus telemetry and thermal protection routines." },
        { version: "v1.1.0", date: "2025-02-01", notes: "Improved FOC algorithm stability at low RPM." },
        { version: "v1.0.0", date: "2024-12-01", notes: "Initial release." },
      ],
      images: [],
      pcbPreviewImage: null,
      cadPreviewImage: null,
      videoUrl: null,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product as any,
      create: product as any,
    });
    console.log(`✓ Upserted product: ${product.title}`);
  }

  console.log("\nDatabase seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
