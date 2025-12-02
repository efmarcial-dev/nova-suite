import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-gradient-to-br from-white/5 to-transparent rounded-xl p-6 border border-[#4E7BFF]/10 hover:border-[#4E7BFF]/30 transition-all"
    >
      {/* Glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at center, rgba(78, 123, 255, 0.1), transparent 70%)',
        }}
      />

      <motion.div
        className="inline-flex p-3 rounded-lg bg-[#4E7BFF]/10 text-[#4E7BFF] mb-4 relative z-10"
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        {icon}
      </motion.div>

      <h4 className="text-xl font-semibold text-gray-800 mb-3 relative z-10">{title}</h4>
      <p className="text-gray-600 text-sm relative z-10">{description}</p>
    </motion.div>
  );
}
