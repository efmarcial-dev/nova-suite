import { motion } from 'motion/react';

interface GeometricShapeProps {
  variant?: 'circle' | 'square' | 'triangle' | 'hexagon';
  size?: number;
  className?: string;
  delay?: number;
}

export function GeometricShape({ variant = 'circle', size = 200, className = '', delay = 0 }: GeometricShapeProps) {
  const shapes = {
    circle: (
      <motion.div
        className={`rounded-full bg-gradient-to-br from-[#4E7BFF]/20 to-[#6B8FFF]/5 blur-3xl ${className}`}
        style={{ width: size, height: size }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          delay,
        }}
      />
    ),
    square: (
      <motion.div
        className={`bg-gradient-to-br from-[#4E7BFF]/20 to-[#6B8FFF]/5 blur-2xl ${className}`}
        style={{ width: size, height: size }}
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          delay,
        }}
      />
    ),
    triangle: (
      <motion.div
        className={`relative ${className}`}
        style={{ width: size, height: size }}
        animate={{
          rotate: [0, 120, 240, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          delay,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#4E7BFF]/20 to-transparent blur-2xl" 
             style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      </motion.div>
    ),
    hexagon: (
      <motion.div
        className={`relative ${className}`}
        style={{ width: size, height: size }}
        animate={{
          rotate: [0, 60, 120, 180, 240, 300, 360],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          delay,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#4E7BFF]/20 to-[#6B8FFF]/5 blur-2xl" 
             style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
      </motion.div>
    ),
  };

  return shapes[variant];
}
