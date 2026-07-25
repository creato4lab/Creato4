import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Monitor } from 'lucide-react';

interface Web3DCtaProps {
  onOpenDiscuss: () => void;
}

export const Web3DCta: React.FC<Web3DCtaProps> = ({ onOpenDiscuss }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    currentMount.appendChild(renderer.domElement);

    // Group for floating shapes
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    // 1. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Interactive Gold Point Light following cursor
    const pointLight = new THREE.PointLight(0xc4a35a, 2.5, 30);
    pointLight.position.set(0, 0, 8);
    scene.add(pointLight);

    // Secondary Accent Rim Light
    const rimLight = new THREE.DirectionalLight(0x3d7a5a, 1.5);
    rimLight.position.set(-10, 10, -5);
    scene.add(rimLight);

    // 2. Geometries & Dual-Layer Metallic / Wireframe Materials
    const matInner = new THREE.MeshPhongMaterial({
      color: 0x1a3c2f,
      emissive: 0x0a1e17,
      specular: 0xc4a35a,
      shininess: 40,
      transparent: true,
      opacity: 0.35,
      flatShading: true,
    });

    const matGoldWire = new THREE.MeshBasicMaterial({
      color: 0xc4a35a,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    const matCreamWire = new THREE.MeshBasicMaterial({
      color: 0xfaf8f5,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    // 8 Floating 3D Geometries
    const geometries = [
      new THREE.IcosahedronGeometry(2, 0),
      new THREE.TorusKnotGeometry(1.4, 0.4, 64, 16),
      new THREE.DodecahedronGeometry(1.8, 0),
      new THREE.OctahedronGeometry(2.2, 0),
      new THREE.TorusGeometry(1.8, 0.5, 16, 32),
      new THREE.RingGeometry(1.2, 2.2, 32),
      new THREE.TetrahedronGeometry(1.8, 0),
      new THREE.IcosahedronGeometry(1.5, 1),
    ];

    const positions = [
      [-7.5, 3.5, -2],
      [7.5, -3.5, -1],
      [-8, -4, -3],
      [8, 4, -2],
      [-4.5, 5, -4],
      [5, -5, -3],
      [-9, 0.5, -5],
      [9, -0.5, -4],
    ];

    const meshes: Array<{
      mesh: THREE.Mesh;
      wireMesh: THREE.Mesh;
      rotSpeed: number[];
      initialY: number;
      floatSpeed: number;
      offset: number;
    }> = [];

    positions.forEach((pos, idx) => {
      const geo = geometries[idx % geometries.length];
      const wireMat = idx % 2 === 0 ? matGoldWire : matCreamWire;

      const mesh = new THREE.Mesh(geo, matInner);
      mesh.position.set(pos[0], pos[1], pos[2]);

      const wireMesh = new THREE.Mesh(geo, wireMat);
      wireMesh.scale.set(1.02, 1.02, 1.02);
      mesh.add(wireMesh);

      shapesGroup.add(mesh);

      meshes.push({
        mesh,
        wireMesh,
        rotSpeed: [
          (Math.random() - 0.5) * 0.012 + 0.005,
          (Math.random() - 0.5) * 0.012 + 0.008,
          (Math.random() - 0.5) * 0.008,
        ],
        initialY: pos[1],
        floatSpeed: 0.8 + Math.random() * 0.6,
        offset: idx * 0.7,
      });
    });

    // 3. Interactive Floating Starfield Particle System
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 35;
      particlePositions[i + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20 - 2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xc4a35a,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Mouse Parallax & Dynamic Light Target
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / group parallax inertia
      shapesGroup.rotation.y += (targetX * 0.25 - shapesGroup.rotation.y) * 0.04;
      shapesGroup.rotation.x += (-targetY * 0.25 - shapesGroup.rotation.x) * 0.04;

      // Update interactive gold point light position
      pointLight.position.x += (targetX * 10 - pointLight.position.x) * 0.08;
      pointLight.position.y += (-targetY * 6 - pointLight.position.y) * 0.08;

      // Rotate particles slowly
      particleSystem.rotation.y = elapsedTime * 0.02;

      // Animate 3D meshes: floating sine waves + 3-axis rotation
      meshes.forEach(({ mesh, rotSpeed, initialY, floatSpeed, offset }) => {
        mesh.rotation.x += rotSpeed[0];
        mesh.rotation.y += rotSpeed[1];
        mesh.rotation.z += rotSpeed[2];

        // Sinusoidal floating wave motion
        mesh.position.y = initialY + Math.sin(elapsedTime * floatSpeed + offset) * 0.45;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative py-24 lg:py-36 bg-[#1A3C2F] text-[#FAF8F5] overflow-hidden">
      
      {/* Background 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Content Container */}
      <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
        
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-8 shadow-sm backdrop-blur-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C4A35A]" />
          <span>WEBGL · THREE.JS · NEXT-GEN WEB</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="heading-h1 font-extrabold text-[#FAF8F5] leading-tight mb-6 tracking-tight drop-shadow-md"
        >
          LOVE THIS DIGITAL EXPERIENCE? <br />
          <span className="text-[#C4A35A]">WE CRAFT NEXT-GEN SITES</span> JUST LIKE IT
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base sm:text-lg text-[#FAF8F5]/80 max-w-xl mx-auto leading-relaxed mb-10"
        >
          From interactive 3D product showcases and WebGL graphics to high-converting web applications — Creato4 engineers digital platforms built to captivate and scale.
        </motion.p>

        {/* CTA Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* Primary CTA */}
          <button
            onClick={onOpenDiscuss}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FAF8F5] text-[#1A3C2F] text-sm font-bold tracking-wide hover:bg-[#FAF8F5]/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-102 cursor-pointer"
          >
            <span>Launch Your Project</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA */}
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#FAF8F5]/40 text-[#FAF8F5] text-sm font-semibold tracking-wide hover:bg-[#FAF8F5]/10 transition-colors duration-300"
          >
            <Monitor className="w-4 h-4 text-[#C4A35A]" />
            <span>Explore Web Services</span>
          </a>
        </motion.div>

        {/* Meta */}
        <p className="text-[0.75rem] text-[#FAF8F5]/50 mt-8 font-medium">
          Zero template bloat · 100% custom 3D WebGL &amp; high-speed React performance.
        </p>

      </div>
    </section>
  );
};
