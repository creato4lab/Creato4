import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seed...");

  // Clean up existing products (optional, but good for idempotency)
  await prisma.product.deleteMany({});
  
  const products = [
    {
      title: "Ultrasonic Radar System",
      slug: "arduino-radar-system",
      description: "A servo-swept obstacle detection radar system utilizing an ultrasonic sensor to map and display distances on a Processing interface.",
      shortDescription: "Servo-swept obstacle detection radar with Processing radar UI.",
      price: 1999,
      category: "ARDUINO",
      difficulty: "BEGINNER",
      hardwareUsed: ["Arduino Uno", "HC-SR04 Sensor", "SG90 Servo", "Breadboard & Jumpers"],
      softwareUsed: ["Arduino IDE", "Processing IDE", "C++"],
      whatsIncluded: ["Complete Arduino Code", "Processing Screen Script", "3D Enclosure STL File", "Circuit Schematic"],
      safetyWarning: "Ensure correct wiring polarity on servo power lines.",
      versionHistory: "v1.0 - Initial Production Release",
      images: ["/arduino-radar.png"],
    },
    {
      title: "Automatic Smart Dustbin",
      slug: "arduino-smart-bin",
      description: "A touchless smart garbage can that automatically opens its lid when hand proximity is detected, ensuring hygienic disposal.",
      shortDescription: "Touchless smart garbage bin with automatic proximity lid.",
      price: 1499,
      category: "ARDUINO",
      difficulty: "BEGINNER",
      hardwareUsed: ["Arduino Uno", "HC-SR04 Sensor", "SG90 Servo", "Battery Shield"],
      softwareUsed: ["Arduino IDE", "C++"],
      whatsIncluded: ["SolidWorks Assembly", "Arduino Sketch", "Wiring Schematic", "BOM Checklist"],
      safetyWarning: "Avoid exposing electronics to wet waste.",
      versionHistory: "v1.0 - Initial Production Release",
      images: ["/arduino-smart-bin.png"],
    },
    {
      title: "Bluetooth Controlled RC Car",
      slug: "arduino-bluetooth-car",
      description: "A 4-wheel drive robotic car controlled remotely via an Android/iOS app over Bluetooth with obstacle detection override.",
      shortDescription: "4WD robotic car controlled via smartphone app over Bluetooth.",
      price: 2799,
      category: "ARDUINO",
      difficulty: "INTERMEDIATE",
      hardwareUsed: ["Arduino Uno", "HC-05 Bluetooth Module", "L298N Motor Driver", "DC Gear Motors"],
      softwareUsed: ["Arduino IDE", "C++", "Android App (MIT App Inventor)"],
      whatsIncluded: ["Chassis Layout PDF", "Arduino Firmware", "Custom Android APK", "Circuit Diagram"],
      safetyWarning: "Check motor driver supply voltage limits (max 12V).",
      versionHistory: "v1.1 - Added obstacle detection override.",
      images: ["/arduino-bluetooth-car.png"],
    },
    {
      title: "RFID Smart Door Lock System",
      slug: "arduino-rfid-lock",
      description: "A secure access control system utilizing RFID cards to trigger a servo/solenoid door lock with an LCD status display.",
      shortDescription: "Secure access control system utilizing RFID cards & solenoid lock.",
      price: 2399,
      category: "ARDUINO",
      difficulty: "INTERMEDIATE",
      hardwareUsed: ["Arduino Uno", "RC522 RFID Module", "16x2 LCD Display", "SG90 Servo / Solenoid"],
      softwareUsed: ["Arduino IDE", "C++", "SPI Library"],
      whatsIncluded: ["Gerber PCB Layout", "Firmware Code", "RFID Register Script", "User Manual"],
      safetyWarning: "Use appropriate relay isolates when driving high-current solenoids.",
      versionHistory: "v1.0 - Initial Release",
      images: ["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80"],
    },
    {
      title: "IoT Weather Station (ESP32)",
      slug: "iot-weather-station",
      description: "Complete blueprint and source code for building a Wi-Fi connected weather station using the ESP32 and BME280 sensor. Features an OLED display and a responsive web dashboard to monitor temperature, humidity, and pressure remotely.",
      shortDescription: "Build a Wi-Fi connected weather station with ESP32 & BME280.",
      price: 299,
      category: "ESP32",
      difficulty: "BEGINNER",
      hardwareUsed: ["ESP32 Dev Board", "BME280 Sensor", "0.96 inch OLED", "Jumper Wires", "Breadboard"],
      softwareUsed: ["Arduino IDE", "C++", "HTML/CSS (Web Server)"],
      whatsIncluded: ["Full C++ Source Code", "Wiring Schematic (Fritzing/PDF)", "Step-by-step Setup Guide", "BOM (Bill of Materials)"],
      safetyWarning: "Ensure correct voltage logic (3.3V) when wiring the BME280 sensor.",
      versionHistory: "v1.2 - Updated Wi-Fi connection logic for better stability.",
      images: ["/placeholder-1.jpg", "/placeholder-2.jpg"],
    },
    {
      title: "6-DOF Robotic Arm Controller",
      slug: "6-dof-robotic-arm",
      description: "Advanced embedded C++ code and PCB schematic for controlling a 6-Degree-of-Freedom robotic arm. Includes inverse kinematics solver and smooth trajectory planning using an Arduino Mega and PCA9685 PWM driver.",
      shortDescription: "Advanced control system for 6-axis robotic arms with inverse kinematics.",
      price: 899,
      category: "ARDUINO",
      difficulty: "ADVANCED",
      hardwareUsed: ["Arduino Mega 2560", "PCA9685 16-Channel PWM", "6x MG996R Servos", "Custom PCB"],
      softwareUsed: ["PlatformIO", "C++", "Python (IK Solver)"],
      whatsIncluded: ["Firmware Source Code", "Eagle PCB Schematic & Board files", "Inverse Kinematics Python Script", "CAD Models for Arm Brackets (STL)"],
      safetyWarning: "Use a dedicated 5V 10A power supply for the servos. Do not power from the Arduino USB.",
      versionHistory: "v2.0 - Migrated to PlatformIO, added custom PCB files.",
      images: ["/placeholder-3.jpg", "/placeholder-4.jpg"],
    },
    {
      title: "Smart Home Automation Hub (Raspberry Pi)",
      slug: "smart-home-hub",
      description: "Transform your Raspberry Pi into a powerful, local smart home hub. Custom Node.js backend and React frontend dashboard to control relays, read MQTT sensors, and integrate with standard protocols without relying on cloud services.",
      shortDescription: "Local-only smart home automation hub for Raspberry Pi.",
      price: 1499,
      category: "RASPBERRY_PI",
      difficulty: "INTERMEDIATE",
      hardwareUsed: ["Raspberry Pi 4", "4-Channel 5V Relay Module", "DHT22 Sensor"],
      softwareUsed: ["Node.js", "React", "Mosquitto (MQTT)", "Docker"],
      whatsIncluded: ["Node.js Backend Code", "React Dashboard Code", "Docker Compose File", "Wiring Diagram"],
      safetyWarning: "Extreme caution required when wiring mains voltage (220V/110V) to relays.",
      versionHistory: "v1.0 - Initial Release",
      images: ["/placeholder-5.jpg", "/placeholder-6.jpg"],
    },
    {
      title: "Custom Mechanical Keyboard PCB (65%)",
      slug: "custom-keyboard-pcb-65",
      description: "Production-ready KiCad files for a 65% layout mechanical keyboard. Features hot-swappable sockets, per-key RGB using SK6812MINI-E, and an RP2040 microcontroller. QMK firmware source code included.",
      shortDescription: "Production-ready KiCad PCB files for a 65% mechanical keyboard.",
      price: 1999,
      category: "PCB_DESIGN",
      difficulty: "EXPERT",
      hardwareUsed: ["RP2040 MCU", "Kailh Hot-Swap Sockets", "SK6812MINI-E RGB LEDs"],
      softwareUsed: ["KiCad 7", "QMK Firmware"],
      whatsIncluded: ["KiCad Schematic & PCB Files", "Gerber Files for Manufacturing", "QMK Firmware Source", "BOM (Excel)"],
      safetyWarning: "Requires advanced SMD soldering skills if assembling manually.",
      versionHistory: "v1.1 - Fixed trace routing near the USB-C port for better structural integrity.",
      images: ["/placeholder-7.jpg", "/placeholder-8.jpg"],
    },
    {
      title: "STM32 Motor Controller Board",
      slug: "stm32-motor-controller",
      description: "High-performance BLDC motor controller design based on the STM32F4 series. Includes FOC (Field Oriented Control) algorithm implementation in C. Perfect for robotics and EV prototyping.",
      shortDescription: "BLDC motor controller schematic and FOC firmware for STM32.",
      price: 2499,
      category: "STM32",
      difficulty: "EXPERT",
      hardwareUsed: ["STM32F405", "DRV8323 Gate Driver", "N-Channel MOSFETs"],
      softwareUsed: ["STM32CubeIDE", "C", "Altium Designer (PDF exports provided)"],
      whatsIncluded: ["C Firmware (FOC Algorithm)", "PDF Schematic", "BOM"],
      safetyWarning: "High current application. Proper heat dissipation and safety fuses are mandatory.",
      versionHistory: "v1.0 - Initial Release",
      images: ["/placeholder-9.jpg", "/placeholder-10.jpg"],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product as any,
      create: product as any,
    });
    console.log(`Created product: ${product.title}`);
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
