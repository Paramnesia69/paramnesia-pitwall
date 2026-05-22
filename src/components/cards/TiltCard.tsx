'use client';

import { useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  accentColor?: string;
  glowOnHover?: boolean;
}

export default function TiltCard({ children, className = '', accentColor, glowOnHover = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  const shineX = useTransform(mouseX, [0, 1], ['-50%', '150%']);
  const shineY = useTransform(mouseY, [0, 1], ['-50%', '150%']);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  const glowColor = accentColor || 'rgba(225, 6, 0, 0.15)';

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="pw-glass p-5 flex flex-col gap-3 cursor-pointer h-full relative overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered && glowOnHover
            ? `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px var(--pw-glass-hover-border), 0 0 40px ${glowColor}`
            : undefined,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Shine overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${shineX.get()}% ${shineY.get()}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
            opacity: isHovered ? 1 : 0,
            left: shineX,
            top: shineY,
            width: '200%',
            height: '200%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Edge light on hover */}
        {isHovered && accentColor && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-px"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}60 50%, transparent)`,
            }}
          />
        )}

        {children}
      </motion.div>
    </motion.div>
  );
}
