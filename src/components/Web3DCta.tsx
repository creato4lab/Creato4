import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Sparkles, Code, Monitor } from 'lucide-react';

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

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

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

    const matSolid = new THREE.MeshBasicMaterial({
      color: 0xfaf8f5,
      transparent: true,
      opacity: 0.08,
      wireframe: false,
    });

    const matWire = new THREE.MeshBasicMaterial({
      color: 0xc4a35a,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });

    // Shapes geometries
    const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
    const sphereGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const torusGeo = new THREE.TorusGeometry(1.8, 0.5, 16, 32);
    const octaGeo = new THREE.OctahedronGeometry(2);

    const items = [
      { geo: cubeGeo, pos: [-6, 3, -2], rot: [0.01, 0.02, 0] },
      { geo: sphereGeo, pos: [6, -3, -1], rot: [0.02, 0.01, 0] },
      { geo: torusGeo, pos: [-7, -4, -3], rot: [0.015, 0.015, 0] },
      { geo: octaGeo, pos: [7, 4, -2], rot: [0.01, 0.02, 0.01] },
    ];

    const meshes: Array<{ mesh: THREE.Mesh; wireMesh: THREE.Mesh; rotSpeed: number[] }> = [];

    items.forEach((item) => {
      const mesh = new THREE.Mesh(item.geo, matSolid);
      mesh.position.set(item.pos[0], item.pos[1], item.pos[2]);

      const wireMesh = new THREE.Mesh(item.geo, matWire);
      wireMesh.scale.set(1.02, 1.02, 1.02);
      mesh.add(wireMesh);

      shapesGroup.add(mesh);
      meshes.push({ mesh, wireMesh, rotSpeed: item.rot });
    });

    // Parallax mouse handler
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      shapesGroup.rotation.y += (targetX * 0.2 - shapesGroup.rotation.y) * 0.05;
      shapesGroup.rotation.x += (-targetY * 0.2 - shapesGroup.rotation.x) * 0.05;

      meshes.forEach(({ mesh, rotSpeed }) => {
        mesh.rotation.x += rotSpeed[0];
        mesh.rotation.y += rotSpeed[1];
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
    <section ref={sectionRef} className="relative py-24 lg:py-36 bg-[#1A3C2F] text-[#FAF8F5] overflow-hidden">
      
      {/* Background 3D WebGL Canvas - Parallax Panorama */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute w-full h-[160%] -top-[30%] left-0 pointer-events-none z-0"
      >
        <div ref={mountRef} className="w-full h-full" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
        
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[#FAF8F5]/80 mb-8"
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
          className="heading-h1 font-extrabold text-[#FAF8F5] leading-tight mb-6 tracking-tight"
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
