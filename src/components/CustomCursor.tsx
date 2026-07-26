import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth trailing effect
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    document.body.classList.add('hide-default-cursor');

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over an interactive element
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('hide-default-cursor');
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Small dot (instant follow) */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FAF8F5] pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: -4,
          top: -4,
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Large trailing ring/blob */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[#FAF8F5] pointer-events-none z-[9998] mix-blend-difference flex items-center justify-center"
        style={{
          left: -16,
          top: -16,
          x: smoothX,
          y: smoothY,
          width: 32,
          height: 32,
        }}
        animate={{
          scale: isHovered ? 1.8 : 1,
          backgroundColor: isHovered ? 'rgba(250, 248, 245, 0.1)' : 'transparent',
          borderWidth: isHovered ? 2 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </>
  );
};
