import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Sparkles, Monitor } from 'lucide-react';

interface Web3DCtaProps {
  onOpenDiscuss: () => void;
}

export const Web3DCta: React.FC<Web3DCtaProps> = ({ onOpenDiscuss }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax for the whole canvas container to give extra depth while scrolling
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    // Use exponential fog to seamlessly blend the terrain into the background color at the horizon
    scene.fog = new THREE.FogExp2(0x1a3c2f, 0.035);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 3, 12);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // ─── TERRAIN (The Panorama Landscape) ─────────────────────────────────
    // A large plane divided into many segments
    const planeGeo = new THREE.PlaneGeometry(80, 80, 80, 80);
    planeGeo.rotateX(-Math.PI / 2);

    const planeMat = new THREE.MeshBasicMaterial({
      color: 0xc4a35a, // Gold wireframe
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    
    const terrain = new THREE.Mesh(planeGeo, planeMat);
    terrain.position.y = -3;
    scene.add(terrain);

    // Save base coordinates for vertex manipulation
    const posAttribute = terrain.geometry.attributes.position;
    const basePositions = new Float32Array(posAttribute.count * 3);
    for (let i = 0; i < posAttribute.count * 3; i++) {
      basePositions[i] = posAttribute.array[i];
    }

    // ─── PARTICLES (Data / Starfield in the sky) ──────────────────────────
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i+=3) {
      particlePos[i] = (Math.random() - 0.5) * 80; // X
      particlePos[i+1] = Math.random() * 25 + 1;   // Y (above terrain)
      particlePos[i+2] = (Math.random() - 0.5) * 80; // Z
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfaf8f5,
      size: 0.06,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── MOUSE INTERACTION ────────────────────────────────────────────────
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ─── ANIMATION LOOP ───────────────────────────────────────────────────
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = performance.now() * 0.0006;

      // 1. Roll the terrain to create endless forward motion
      const positions = terrain.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < posAttribute.count; i++) {
        const x = basePositions[i * 3];
        const z = basePositions[i * 3 + 2];
        
        // Combine multiple sine waves for organic digital topography
        const wave1 = Math.sin(x * 0.2 + time) * 0.8;
        const wave2 = Math.cos(z * 0.2 + time) * 0.8;
        const wave3 = Math.sin((x + z) * 0.1 - time * 1.5) * 1.5;
        
        positions[i * 3 + 1] = basePositions[i * 3 + 1] + wave1 + wave2 + wave3;
      }
      terrain.geometry.attributes.position.needsUpdate = true;

      // 2. Slowly pan the particle sky to enhance the panorama feel
      particles.rotation.y = time * 0.03;

      // 3. Smoothly interpolate camera position based on mouse (parallax)
      camera.position.x += (targetX * 3 - camera.position.x) * 0.03;
      // Slight vertical tilt
      camera.position.y += (4 + targetY * -1.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 1, 0);

      renderer.render(scene, camera);
    };

    animate();

    // ─── RESIZE HANDLER ───────────────────────────────────────────────────
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
      // Clean up WebGL resources
      planeGeo.dispose();
      planeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[200vh] bg-[#1A3C2F] text-[#FAF8F5]">
      
      {/* Sticky Panorama Window */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">

        {/* Background 3D WebGL Canvas - Parallax Panorama */}
        <motion.div 
          style={{ y: backgroundY }}
          className="absolute w-full h-[120%] -top-[10%] left-0 pointer-events-none z-0"
        >
          <div ref={mountRef} className="w-full h-full" />
        </motion.div>

        {/* Radial Gradient Overlay - Softer center for better visibility of 3D scene */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,rgba(26,60,47,0.1)_0%,rgba(26,60,47,0.75)_100%)]" />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[800px] mx-auto px-6 text-center">
          
          {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[#FAF8F5]/90 backdrop-blur-md mb-8 shadow-lg"
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
          className="heading-h1 font-extrabold text-[#FAF8F5] leading-tight mb-6 tracking-tight drop-shadow-2xl"
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
          className="text-base sm:text-lg text-[#FAF8F5]/90 max-w-xl mx-auto leading-relaxed mb-10 drop-shadow-md"
        >
          From interactive 3D product showcases and panoramic WebGL environments to high-converting web applications — Creato4 engineers digital platforms built to captivate and scale.
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
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FAF8F5] text-[#1A3C2F] text-sm font-bold tracking-wide hover:bg-[#E8E2D9] transition-all duration-300 shadow-[0_0_40px_rgba(250,248,245,0.2)] hover:shadow-[0_0_60px_rgba(250,248,245,0.4)] hover:scale-105 cursor-pointer"
          >
            <span>Launch Your Project</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA */}
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#FAF8F5]/40 text-[#FAF8F5] text-sm font-semibold tracking-wide hover:bg-[#FAF8F5]/10 transition-colors duration-300 backdrop-blur-sm"
          >
            <Monitor className="w-4 h-4 text-[#C4A35A]" />
            <span>Explore Web Services</span>
          </a>
        </motion.div>

        {/* Meta */}
        <p className="text-[0.75rem] text-[#FAF8F5]/50 mt-10 font-medium">
          Zero template bloat · 100% custom 3D WebGL &amp; high-speed React performance.
        </p>

      </div>
      </div>
    </section>
  );
};

