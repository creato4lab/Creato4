'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Boxes,
  Code2,
  Wrench,
  Layers,
  Zap,
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshWobbleMaterial, Sparkles as ThreeSparkles, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface FromIdeaToRealityProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenDiscuss?: (topic?: string) => void;
}

// 3D Scene Components for Each Cinematic Stage

// Scene 1: The Floating Idea Sketch
function SceneSketch() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3.2, 4.2, 0.1]} />
        <meshStandardMaterial color="#F5E5CA" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Blueprint Grid Lines Accent */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[3.0, 4.0]} />
        <meshBasicMaterial color="#224B27" wireframe opacity={0.3} transparent />
      </mesh>
    </Float>
  );
}

// Scene 2: The Confusion Chaos Particles
function SceneChaos() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <ThreeSparkles count={80} scale={8} size={4} speed={0.8} color="#F5E5CA" />
      {[...Array(12)].map((_, i) => (
        <Float key={i} speed={3 + (i % 3)} rotationIntensity={2} floatIntensity={2}>
          <mesh position={[(i % 4 - 1.5) * 2, (Math.floor(i / 4) - 1) * 1.8, (i % 2 - 0.5) * 2]}>
            <octahedronGeometry args={[0.3 + (i % 3) * 0.1]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#C4A35A" : "#2D5929"} wireframe />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Scene 3: Creato4 Team Structured Transformation
function SceneTeam() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 4 Pillars of Engineering */}
      {[-2.2, -0.7, 0.7, 2.2].map((x, idx) => (
        <Float key={idx} speed={1.5} floatIntensity={0.5}>
          <group position={[x, 0, 0]}>
            <RoundedBox args={[1.2, 2.4, 0.4]} radius={0.15} smoothness={4}>
              <meshStandardMaterial color="#224B27" roughness={0.2} metalness={0.8} />
            </RoundedBox>
            <mesh position={[0, 0, 0.22]}>
              <planeGeometry args={[1.0, 2.2]} />
              <meshBasicMaterial color="#F5E5CA" wireframe opacity={0.4} transparent />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

// Scene 4: Morphing Engineering Sequence (Blueprint -> PCB -> Product)
function SceneEngineering() {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.6;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      <ThreeSparkles count={50} scale={6} size={3} speed={0.5} color="#F5E5CA" />
      {/* PCB Base */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[3.8, 0.15, 2.8]} />
        <meshStandardMaterial color="#224B27" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Circuit Traces Outline */}
      <mesh position={[0, -0.31, 0]}>
        <boxGeometry args={[3.82, 0.02, 2.82]} />
        <meshBasicMaterial color="#F5E5CA" wireframe opacity={0.6} transparent />
      </mesh>
      {/* Floating Chips & 3D Components */}
      <Float speed={2} floatIntensity={0.8}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.2, 0.3, 1.2]} />
          <meshStandardMaterial color="#102A20" roughness={0.1} metalness={0.9} />
        </mesh>
      </Float>
    </group>
  );
}

// Scene 5: Finished Working Product Rotator
function SceneProduct() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group ref={groupRef}>
      <ThreeSparkles count={100} scale={10} size={5} speed={0.4} color="#F5E5CA" />
      {/* Final Assembled Shell */}
      <RoundedBox args={[3.4, 2.0, 2.4]} radius={0.2} smoothness={5}>
        <meshStandardMaterial color="#224B27" roughness={0.15} metalness={0.85} />
      </RoundedBox>
      <mesh position={[0, 0, 1.21]}>
        <planeGeometry args={[3.0, 1.6]} />
        <meshStandardMaterial color="#F5E5CA" roughness={0.1} metalness={0.9} />
      </mesh>
    </group>
  );
}

export const FromIdeaToReality: React.FC<FromIdeaToRealityProps> = ({
  isOpen = true,
  onClose,
  onOpenDiscuss,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const steps = [
    {
      number: '01',
      title: 'The Idea',
      text: 'I have an idea.',
      subtext: 'A simple sketch, a spark of inspiration, or a napkin calculation.',
      badge: 'CONCEPT SKETCH',
    },
    {
      number: '02',
      title: 'The Chaos',
      text: "But I don't know where to start.",
      subtext: 'Electronics? PCB Design? Firmware? CAD? Manufacturing? Cost? Vendors?',
      badge: 'OVERWHELMED WITH QUESTIONS',
    },
    {
      number: '03',
      title: 'Creato4 Steps In',
      text: 'You bring the idea.',
      subtext: 'Our multi-disciplinary team of 4 engineers takes complete ownership of your project.',
      badge: 'ONE TRUSTED ENGINEERING TEAM',
    },
    {
      number: '04',
      title: 'Engineering Flow',
      text: 'We build the rest.',
      subtext: '3D CAD → PCB Routing → C++ Firmware → Prototyping → Testing → Assembly.',
      badge: 'FULL STACK EXECUTION',
    },
    {
      number: '05',
      title: 'Working Reality',
      text: 'We Turn Ideas Into Reality.',
      subtext: 'You receive a fully functional, production-ready physical product.',
      badge: 'READY FOR MARKET',
    },
  ];

  // Auto advance timeline every 3 seconds if playing
  useEffect(() => {
    if (!isPlaying || !isOpen) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 3200);

    return () => clearInterval(timer);
  }, [isPlaying, isOpen, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#102A20] text-[#FAF8F5] flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* TOP BAR / NAVIGATION */}
      <div className="relative z-30 flex items-center justify-between px-6 sm:px-10 py-6 border-b border-[#F5E5CA]/10 bg-[#102A20]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#224B27] border border-[#F5E5CA]/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#F5E5CA]" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-[#FAF8F5]">
              From Idea to Reality
            </h2>
            <p className="text-[10px] text-[#F5E5CA]/70 uppercase tracking-widest font-mono">
              Creato4 Lab Visual Storyline
            </p>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="hidden md:flex items-center gap-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
                currentStep === idx
                  ? 'bg-[#F5E5CA] text-[#102A20] shadow-lg scale-105'
                  : 'bg-white/5 text-[#FAF8F5]/60 hover:bg-white/10'
              }`}
            >
              {step.number} {step.title}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#F5E5CA] transition-colors"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF8F5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* CENTER 3D VISUALIZATION CANVAS */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        {/* Ambient Volumetric Lighting Effects */}
        <div className="absolute inset-0 bg-radial from-[#224B27]/40 via-transparent to-transparent pointer-events-none" />
        
        {/* 3D WebGL Scene Canvas */}
        <div className="absolute inset-0 z-10">
          <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
            <color attach="background" args={['#102A20']} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#F5E5CA" />

            {currentStep === 0 && <SceneSketch />}
            {currentStep === 1 && <SceneChaos />}
            {currentStep === 2 && <SceneTeam />}
            {currentStep === 3 && <SceneEngineering />}
            {currentStep === 4 && <SceneProduct />}

            <OrbitControls enableZoom={false} autoRotate={currentStep === 4} autoRotateSpeed={1.5} />
          </Canvas>
        </div>

        {/* OVERLAY TEXT STORY & CONTENT CARDS */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* Scene Badge */}
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#224B27]/80 border border-[#F5E5CA]/30 text-[#F5E5CA] text-[11px] font-mono font-bold tracking-widest uppercase mb-6 shadow-2xl backdrop-blur-md">
                {steps[currentStep].badge}
              </span>

              {/* Main Visual Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#FAF8F5] tracking-tight leading-tight mb-4 drop-shadow-2xl">
                {steps[currentStep].text}
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-xl text-[#F5E5CA]/80 max-w-2xl leading-relaxed font-normal mb-8">
                {steps[currentStep].subtext}
              </p>

              {/* Step 5 CTAs */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto mt-4"
                >
                  <button
                    onClick={() => onOpenDiscuss?.('Share Your Idea')}
                    className="px-8 py-4 rounded-full bg-[#F5E5CA] text-[#102A20] font-bold text-sm hover:bg-white transition-all shadow-2xl hover:scale-105 cursor-pointer flex items-center gap-2"
                  >
                    <span>Share Your Idea</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenDiscuss?.('Book Free Consultation')}
                    className="px-8 py-4 rounded-full border border-[#F5E5CA] bg-white/5 text-[#FAF8F5] font-bold text-sm hover:bg-white/10 transition-all backdrop-blur-md cursor-pointer flex items-center gap-2"
                  >
                    <span>Book Free Consultation</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM CONTROLS & TIMELINE SCRUBBER */}
      <div className="relative z-30 px-6 sm:px-10 py-6 border-t border-[#F5E5CA]/10 bg-[#102A20]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Timeline Bar */}
          <div className="w-full sm:w-1/2 flex items-center gap-3">
            <span className="text-xs font-mono text-[#F5E5CA]">0{currentStep + 1} / 05</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative cursor-pointer">
              <motion.div
                className="h-full bg-[#F5E5CA]"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 text-xs font-bold text-[#FAF8F5] transition-colors"
            >
              Previous
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-full bg-[#224B27] hover:bg-[#2D5929] border border-[#F5E5CA]/30 text-xs font-bold text-[#F5E5CA] transition-colors"
            >
              {isPlaying ? 'Pause Story' : 'Auto Play'}
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="px-5 py-2 rounded-full bg-[#F5E5CA] text-[#102A20] text-xs font-bold hover:bg-white transition-all flex items-center gap-1.5 shadow-lg"
              >
                <span>Next Scene</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(0)}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-[#FAF8F5] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
