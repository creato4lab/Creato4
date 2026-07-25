import { WorkProject, StudentProject, ServiceItem, ProcessStep, TeamMember } from './types';

export const WORK_PROJECTS: WorkProject[] = [
  {
    id: 'health-kiosk',
    title: 'Smart Privacy Health Kiosk',
    subtitle: 'An IoT-Enabled Automated System for Anonymous Access to Sensitive Healthcare Products',
    category: 'IoT Systems · Mechanical Design · Embedded Firmware · Product Innovation',
    tags: ['IoT Systems', 'Mechanical Design', 'Embedded Firmware', 'Product Innovation'],
    image: '/smart-health-kiosk.jpg',
    description: 'An IoT-enabled, privacy-first automated kiosk designed for 24×7 anonymous access to sensitive healthcare and wellness products (like sanitary pads, pregnancy test kits, and intimate care products), eliminating social stigma and judgment.',
    challenge: 'Designing an Automatic Privacy Packaging System (APPS) and a secure collection locker within a single deployable unit while maintaining reliable multilingual touchscreen control and cashless UPI payments.',
    solution: 'Engineered a custom internal packaging mechanism that bags products automatically before delivery, integrated fingerprint biometrics, RFID maintenance access, low-stock alerts, jam detection, and a remote IoT monitoring dashboard.',
    technologies: ['15-inch Touch UI', 'Automatic Packaging (APPS)', 'ESP32 / STM32', 'UPI Payment Integration', 'Fingerprint Biometrics', 'RFID Access'],
    outcomes: [
      'Awarded ₹2,30,000 PoC grant by SPU-SSIP Navadhārā',
      'Developed Automatic Privacy Packaging System (APPS) for discreet pickup',
      'Integrated 24x7 Emergency Pad Mode for dispensing when payment servers are down',
      'Built remote IoT dashboard for real-time inventory and predictive restocking',
    ],
    featured: true,
  },
  {
    id: 'agri-titan-x6',
    title: 'AGRI-TITAN X6',
    subtitle: 'Smart Modular Precision Agriculture Hexacopter',
    category: 'Drone Engineering · Precision Agriculture · Embedded Systems',
    tags: ['Drone Engineering', 'Precision Agriculture', 'Embedded Systems'],
    badge: 'SSIP-Funded Project',
    image: '/agri-titan-drone-2.png',
    description: 'A heavy-duty smart agricultural hexacopter designed to automate spraying, seeding, and crop protection. Built with a modular plug-and-play payload system, it enables cost-effective precision farming for small and medium-scale fields.',
    challenge: 'Designing a structurally rigid 1200mm hexacopter frame capable of carrying a 10-liter liquid payload (4-6 kg functional weight) while maintaining stable autonomous flight dynamics under variable wind conditions.',
    solution: 'Implemented a Pixhawk autopilot system running ArduPilot flight firmware, a Hobbywing X6 Plus propulsion system, LiDAR-based terrain following, thermal/PIR sensors for night-time wildlife intrusion detection, and a modular pogo-pin connector interface.',
    technologies: ['Pixhawk Autopilot', 'ArduPilot / Mission Planner', 'LiDAR (TFmini-S / TF-Luna)', 'Hobbywing X6 Plus Propulsion', 'Thermal / PIR Sensors', 'Modular Pogo-Pin Connectors'],
    outcomes: [
      'Funded by SSIP 2.0 with a prototype budget estimation of ₹2,42,627',
      'Achieved fully autonomous GPS-based waypoint navigation and terrain-following altitude stabilization',
      'Designed a multi-nozzle 10-liter spraying module and an 8-10 kg PWM-controlled seed broadcasting hopper',
      'Integrated thermal/PIR sensors with siren repeller to reduce crop damage from wildlife by 10-15%',
    ],
    featured: false,
  },
  {
    id: 'smart-print-station',
    title: 'PrintPoint',
    subtitle: '24/7 Self-Service Document & Stationery Vending Kiosk',
    category: 'Embedded Systems · Automation · Web Platform',
    tags: ['Embedded Systems', 'Automation', 'Web Platform'],
    image: '/smart-print-station.png',
    description: 'A 24/7 self-service document kiosk designed to provide round-the-clock access to black & white or color printing, photocopying, scanning, passport photo printing, and integrated stationery vending with secure UPI payments.',
    challenge: 'Integrating robust mechanical vending for office supplies alongside high-speed laser printing, dual-page scanning, and automated post-processing like document stapling and lamination.',
    solution: 'Engineered a custom unattended kiosk enclosure housing a passport photo printer, stationery vending spiral tracks, a touch control panel for QR document upload, and automatic file deletion for user privacy.',
    technologies: ['Raspberry Pi 4', 'Laser & Thermal Automation', 'UPI Payment Gateway', 'Node.js / React', 'OpenCV Image Processing'],
    outcomes: [
      'Designed modular internal layout for dual-printer, scanner, and stationery dispenser configuration',
      'Supports 24/7 instant printing via WhatsApp, QR upload, or USB drive connection',
      'Implemented a secure collection locker and privacy-first confidential document auto-delete protocol',
      'Integrated multi-size photocopy presets and OCR text extraction capabilities',
    ],
    featured: false,
  },
  {
    id: 'smart-safety-helmet',
    title: 'Smart Safety Helmet',
    subtitle: 'Automatic Smart LED Work Light for Electrical Linemen',
    category: 'Hardware Design · Embedded Systems · Safety Technology',
    tags: ['Hardware Design', 'Embedded Systems', 'Safety Technology'],
    badge: 'State-Level Winning Project',
    image: '/smart-safety-helmet.jpg',
    description: 'A smart safety helmet featuring a microcontroller-free, hardware-driven automatic LED work light designed for GUVNL linemen. It automates illumination dynamically based on darkness and distance to ensure safe, hands-free nighttime power restoration.',
    challenge: 'Designing a robust, ultra-low cost, and energy-efficient control circuit using pure digital logic gates (no microcontroller) while maintaining reliable distance-based beam switching and sensor integration.',
    solution: 'Implemented LDR-based ambient light sensing, IR-based distance detection for automatic high/low beam switching, HR202 humidity sensing for amber light warning, CD4093-based micro flasher circuit for SOS distress signaling, and TP4056-based battery charging.',
    technologies: ['Digital Logic Gates', 'LDR Sensor', 'IR Sensor (HW201)', 'Humidity Sensor (HR202)', 'Micro Flasher (CD4093)', 'TP4056 Power Module'],
    outcomes: [
      'Designed and built prototype at a cost of only ₹423',
      'Successfully bypassed microcontrollers using digital gates, maximizing battery efficiency and ruggedness',
      'Implemented automatic distance-based beam switching (focus vs. spread light)',
      'Integrated independent SOS emergency circuitry that works even if the main lights fail',
    ],
    featured: false,
  },

  {
    id: 'water-leakage-theft',
    title: 'IoT-enabled Water Leakage & Theft Detection System',
    subtitle: 'Prepaid Water Meter, Real-Time Flow & Quality Monitoring, and Mesh Network Telemetry',
    category: 'IoT Systems · Water Tech · Embedded Firmware · Smart Utilities',
    tags: ['IoT Systems', 'Water Tech', 'Embedded Firmware', 'Smart Utilities'],
    badge: 'National Level Runner Up Project',
    image: '/water-leakage-theft.jpg',
    description: 'A smart prepaid IoT water meter system featuring a 3-device ecosystem (User Meter, Society Node, and Government Unit) designed for the BGI Hackathon 2026. It monitors water quantity and quality (TDS, Turbidity, pH) in real-time while detecting leakages, pipe cuts, and meter tampering.',
    challenge: 'Detecting micro-leakages, illegal pipe cuts before the meter, and physical meter tampering in real-time while ensuring offline communication reliability in remote areas.',
    solution: 'Engineered a dual-dashboard prepaid water control system utilizing ESP32 microcontrollers, YF-S201 flow sensors, pressure sensors, MPU6050 IMUs for tamper detection, and TDS/Turbidity/pH probes. Implemented an offline-first mesh network (ESP-NOW) with SD storage to sync data when Wi-Fi is unavailable, alongside a manual emergency water reserve trigger.',
    technologies: ['ESP32', 'ESP-NOW Mesh', 'YF-S201 Flow Sensor', 'MPU6050 Accelerometer', 'TDS / Turbidity / pH Sensors', 'Firebase Firestore'],
    outcomes: [
      'Selected for BGI Hackathon 2026 Theme: Smart Cities & Urban Innovation',
      'Designed a 3-device architecture (User Meter, Society Node, and Government Unit) with sub-1 second response time',
      'Built a prepaid recharge system with offline emergency override buttons',
      'Successfully combined water quality metrics (TDS, pH) with volume tracking in a single smart meter',
    ],
    featured: false,
  },
  {
    id: 'density-traffic-controller',
    title: 'Density-Based Traffic Light Controller',
    subtitle: 'Real-Time Traffic Queue Analysis & Adaptive Signal Timing System',
    category: 'Embedded Systems · Smart City · Automation · Computer Vision',
    tags: ['Embedded Systems', 'Smart City', 'Automation', 'Computer Vision'],
    badge: 'Smart City Solution',
    image: '/density-traffic-controller.jpg',
    description: 'An adaptive traffic signal control system utilizing ultrasonic distance sensors, infrared vehicle counters, and camera vision feeds to dynamically adjust green light duration based on real-time junction congestion.',
    challenge: 'Replacing fixed timer traffic signals with low-latency adaptive algorithms to reduce urban traffic gridlock and prioritize emergency vehicles.',
    solution: 'Integrated ultrasonic sensor arrays per lane with microcontroller interrupt timers and custom priority routing for emergency ambulances equipped with RF transponders.',
    technologies: ['Microcontroller Firmware', 'Ultrasonic Sensor Array', 'IR Vehicle Detection', 'Emergency RF Priority Sync', 'Traffic Analytics Portal'],
    outcomes: ['35% reduction in average junction waiting time', 'Automatic priority green corridor for emergency vehicles', 'Field-tested across multi-lane test intersections'],
    featured: false,
  },
];

export const STUDENT_PROJECTS: StudentProject[] = [];

export const SERVICES: ServiceItem[] = [
  {
    id: 'product-engineering',
    title: 'Product Engineering',
    description: 'End-to-end product architecture, feasibility analysis, system design, functional prototyping, and manufacturing preparation.',
    features: [
      'Discovery & Concept Feasibility',
      'System Architecture & Bill of Materials (BOM)',
      'Rapid Functional Prototyping',
      'Testing & Validation Protocols',
      'DFM (Design for Manufacturing) Handover',
    ],
    cta: 'Discuss a Product Idea →',
    iconName: 'Cpu',
  },
  {
    id: 'mechanical-cad',
    title: 'Mechanical Design & CAD',
    description: 'Industrial design, 3D CAD modeling, complex enclosure design, internal mechanisms, stress simulation, and 3D printing optimization.',
    features: [
      '3D Parametric CAD (SolidWorks/Fusion 360)',
      'Custom Enclosure & Mechanical Mounts',
      'FEA Stress & Thermal Simulation',
      'Tolerance Stackup Analysis',
      'Rapid Prototyping & CNC Machining Prep',
    ],
    cta: 'Start a Mechanical Project →',
    iconName: 'Boxes',
  },
  {
    id: 'electronics-pcb',
    title: 'Electronics & PCB',
    description: 'Custom PCB schematic capture, high-speed multi-layer layout, component selection, signal integrity, and circuit board assembly.',
    features: [
      'Schematic Capture & Component Sourcing',
      'Multi-Layer High-Density PCB Layout',
      'Power Management & Battery Circuits',
      'Sensor Integration & Signal Conditioning',
      'SMD Prototype Assembly & Testing',
    ],
    cta: 'Discuss an Electronics Project →',
    iconName: 'Zap',
  },
  {
    id: 'embedded-iot',
    title: 'Embedded Systems & IoT',
    description: 'Microcontroller firmware development, real-time operating systems (RTOS), IoT connectivity protocols, and sensor telemetry.',
    features: [
      'Firmware (ESP32, STM32, Nordic, Arduino)',
      'FreeRTOS & Embedded C/C++ Optimization',
      'BLE, Wi-Fi, LoRa, MQTT Protocols',
      'Over-The-Air (OTA) Firmware Updates',
      'Low-Power Sleep Modes & Battery Optimization',
    ],
    cta: 'Build an Embedded System →',
    iconName: 'Radio',
  },
  {
    id: 'software-development',
    title: 'Software Development',
    description: 'Full-stack web applications, custom management dashboards, cloud APIs, cross-platform mobile apps, and real-time control panels.',
    features: [
      'React / TypeScript Modern Web Apps',
      'Express & Node.js Backend Microservices',
      'Real-Time WebSocket Data Dashboards',
      'REST & GraphQL API Engineering',
      'Cloud Infrastructure & CI/CD Pipelines',
    ],
    cta: 'Discuss a Software Project →',
    iconName: 'Code2',
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    description: 'Computer vision integration, automated workflow pipelines, smart hardware edge-AI models, and generative AI features.',
    features: [
      'Computer Vision & Object Detection',
      'Edge AI Inference (TensorFlow Lite)',
      'Industrial Process Automation Pipelines',
      'Custom Gemini & LLM AI Integrations',
      'Predictive Maintenance Algorithms',
    ],
    cta: 'Explore AI Solutions →',
    iconName: 'Sparkles',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'DISCOVER',
    subtitle: 'Understanding Your Vision',
    description: 'We sit down with you to understand exactly what you want to build. We figure out the challenges, set goals, and create a clear step-by-step plan to bring your idea to life.',
    deliverables: ['Product Requirements', 'Technology Plan', 'Project Timeline'],
    shapeType: 'cube',
  },
  {
    number: '02',
    title: 'FEASIBILITY',
    subtitle: 'Proving It Works',
    description: 'Before going all-in, we do quick tests to make sure the idea actually works. We build basic test models, check if parts are available, and estimate how much the final product will cost to make.',
    deliverables: ['Basic Test Model', 'Initial Parts List', 'Cost Estimate'],
    shapeType: 'sphere',
  },
  {
    number: '03',
    title: 'ARCHITECT',
    subtitle: 'Creating The Blueprint',
    description: 'This is where we create the master plan. We map out the internal electronics, figure out how the physical parts will fit together, and plan how the software will communicate with the hardware.',
    deliverables: ['System Blueprint', 'Electronics Plan', '3D Layout'],
    shapeType: 'torus',
  },
  {
    number: '04',
    title: 'DESIGN',
    subtitle: 'Looks & User Experience',
    description: 'We design the look and feel of your product. We create 3D models of the physical casing so it looks great, and we design beautiful digital screens and apps if your product needs them.',
    deliverables: ['3D Product Design', 'Circuit Board Files', 'App/Screen Designs'],
    shapeType: 'octahedron',
  },
  {
    number: '05',
    title: 'PROTOTYPE',
    subtitle: 'Building The First Version',
    description: 'We build the first real version of your product! We 3D-print the casing, put together the custom electronics boards, and load the initial software so we can test the real thing in our hands.',
    deliverables: ['Physical 3D Prototype', 'Custom Electronics Board', 'Basic Software'],
    shapeType: 'ring',
  },
  {
    number: '06',
    title: 'INTEGRATE',
    subtitle: 'Connecting To The Cloud',
    description: 'We connect the physical product to the digital world. We make sure the hardware sensors, the cloud servers, and your mobile apps are all talking to each other perfectly without any delays.',
    deliverables: ['Cloud Connection', 'Control Dashboard', 'Wireless Update System'],
    shapeType: 'pyramid',
  },
  {
    number: '07',
    title: 'TEST & ITERATE',
    subtitle: 'Making It Bulletproof',
    description: 'We push the prototype to its limits. We test it for heat, drop it to check durability, fix any bugs, and keep making improvements until it works flawlessly every single time.',
    deliverables: ['Quality Testing Report', 'Durability Results', 'Final Polished Software'],
    shapeType: 'cylinder',
  },
  {
    number: '08',
    title: 'DELIVER',
    subtitle: 'Handing Over The Keys',
    description: 'You get your finished product. We hand over the fully working physical units, along with all the design files, source code, and manufacturing instructions you need to mass-produce it.',
    deliverables: ['Working Products', 'Manufacturing Guide', 'Full Source Code'],
    shapeType: 'knot',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'prince-tagadiya',
    initials: 'PT',
    name: 'Prince Tagadiya',
    role: 'Founder, CEO & CPTO',
    department: 'Product · Technology · Business Strategy',
    tags: ['Product Strategy', 'Systems Architecture', 'Hardware R&D', 'Business Lead'],
    bio: 'Visionary engineering lead steering multidisciplinary hardware and software product creation from initial napkin sketch to scaled deployment.',
    expandedBio: 'Prince leads CRETO4\'s overall product roadmap, hardware-software architecture integration, and strategic client ventures. With deep expertise across cross-disciplinary engineering and industrial prototyping, he bridges conceptual client vision into robust physical products.',
    keyContributions: [
      'Architected the Smart Privacy Health Kiosk hardware & cloud pipeline',
      'Spearheaded SSIP Government Innovation Grant acquisition',
      'Directs multidisciplinary R&D across embedded, CAD, and software teams'
    ],
    specialties: ['Cross-disciplinary Systems Architecture', 'Industrial DFM & Rapid Prototyping', 'Venture Strategy & Client Delivery'],
    stats: [
      { label: 'Projects Led', value: '25+' },
      { label: 'R&D Experience', value: '4+ Yrs' },
      { label: 'Grants Secured', value: 'SSIP' }
    ]
  },
  {
    id: 'nisarg-patel',
    initials: 'NP',
    name: 'Nisarg Patel',
    role: 'Head of Electronics, Embedded Systems & Manufacturing',
    department: 'Hardware · Embedded · Electronics Manufacturing',
    tags: ['Hardware Engineering', 'Embedded C++', 'DFM', 'Sensors'],
    bio: 'Expert in high-reliability circuit design, power management, micro-controller firmware, and precision electronics manufacturing pipelines.',
    expandedBio: 'Nisarg leads the physical electronics engineering at CRETO4. From high-current power distribution boards for heavy-payload hexacopters to sub-second sensor telemetry hubs, he ensures ultra-reliable hardware performance under demanding operational environments.',
    keyContributions: [
      'Designed custom PDB and RTK-GPS telemetry for Agri-Titan X6 drone',
      'Developed sub-100mW power management for Smart Safety Helmet',
      'Established in-house SMT assembly & hardware verification protocols'
    ],
    specialties: ['STM32 & ESP32 Embedded C/C++', 'Power Electronics & Battery Systems', 'Sensor Telemetry & RF Communication'],
    stats: [
      { label: 'Custom PCBs', value: '40+' },
      { label: 'Sensor Modules', value: '100+' },
      { label: 'Uptime Rate', value: '99.9%' }
    ]
  },
  {
    id: 'khushi-belani',
    initials: 'KB',
    name: 'Khushi Belani',
    role: 'Head of PCB Design, Education & Brand Communications',
    department: 'PCB Design · Research · QA · Education · Brand',
    tags: ['PCB Layout', 'Signal Integrity', 'Quality Assurance', 'Brand Communication'],
    bio: 'Directs multi-layer PCB layout, component selection, educational project publishing, and technical brand positioning.',
    expandedBio: 'Khushi oversees high-density PCB design standards, electromagnetic compatibility (EMC) compliance, and technical publishing. She also leads CRETO4\'s educational STEM initiative, translating complex hardware designs into accessible learning kits for student engineers.',
    keyContributions: [
      'Published technical research articles in Electronics For You magazine',
      'Engineered multi-layer HDI PCB layouts for IoT diagnostic kiosks',
      'Curated DIY engineering kit documentation and Gerber manufacturing specs'
    ],
    specialties: ['Altium Designer Multi-Layer HDI Routing', 'Signal & Power Integrity Analysis', 'Technical Publishing & Brand Strategy'],
    stats: [
      { label: 'Publications', value: 'Featured' },
      { label: 'PCB Layers', value: '4-6 Layers' },
      { label: 'Kits Created', value: '15+' }
    ]
  },
  {
    id: 'rudra-chauhan',
    initials: 'RC',
    name: 'Rudra Chauhan',
    role: 'Head of Software Engineering & Digital Design',
    department: 'Software · Cloud Infrastructure · Digital Experiences',
    tags: ['Full-Stack Web', 'Cloud Infrastructure', '3D WebGL', 'AI Systems'],
    bio: 'Architects modern cloud applications, real-time IoT web portals, interactive 3D WebGL graphics, and scalable software backends.',
    expandedBio: 'Rudra directs the digital experience engineering at CRETO4. Combining full-stack React/Node web platforms with real-time hardware WebSockets, 3D WebGL visualizations, and modern AI/LLM API integrations, he delivers seamless software control for physical hardware devices.',
    keyContributions: [
      'Built full-stack real-time telemetry dashboard for Smart Health Kiosk',
      'Designed high-performance 3D WebGL interactive product visualizers',
      'Engineered zero-latency MQTT cloud queues for IoT print terminals'
    ],
    specialties: ['React / TypeScript / Vite / WebGL', 'Node.js, WebSockets & MQTT Telemetry', 'Cloud Infrastructure & API Design'],
    stats: [
      { label: 'Web Applications', value: '30+' },
      { label: 'Daily Telemetry', value: '50k+ Events' },
      { label: '3D Assets', value: 'Interactive' }
    ]
  }
];

export const TRUST_ACHIEVEMENTS = [
  { id: '1', label: 'SSIP FUNDED', detail: 'Government Student Startup & Innovation Policy Grant Recipient for Agriculture Drone Innovation.' },
  { id: '2', label: 'STATE-LEVEL WINNER', detail: '1st Rank State-Level Product Engineering Competition in Smart Safety & IoT Solutions.' },
  { id: '3', label: 'RUNNER-UP AMONG 900+ PARTICIPANTS', detail: 'National Technical Prototype Hackathon top-tier distinction among 950+ participating engineering teams.' },
  { id: '4', label: 'PUBLISHED IN ELECTRONICS FOR YOU', detail: 'Featured technical research article and circuit design in Asia\'s leading electronics magazine.' },
  { id: '5', label: 'REAL PROTOTYPES', detail: '100% real, physically fabricated and field-tested hardware and software engineering systems.' },
];
