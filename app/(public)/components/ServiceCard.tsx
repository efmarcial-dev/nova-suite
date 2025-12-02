import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features?: string[];
  delay?: number;
  onClick?: () => void;
}

export function ServiceCard({ icon, title, description, features, delay = 0, onClick }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8 }}
      className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-[#4E7BFF]/10 hover:border-[#4E7BFF]/30 transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4E7BFF]/0 to-[#4E7BFF]/0 group-hover:from-[#4E7BFF]/10 group-hover:to-transparent transition-all duration-500" />
      
      {/* Icon */}
      <motion.div
        className="inline-flex p-4 rounded-xl bg-[#4E7BFF]/10 text-[#4E7BFF] mb-6 relative z-10"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {icon}
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-gray-800 mb-3 relative z-10">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 relative z-10">
        {description}
      </p>

      {/* Features */}
      {features && (
        <ul className="space-y-2 mb-6 relative z-10">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2 text-slate-500 text-sm">
              <span className="text-[#4E7BFF] mt-1">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Arrow */}
      <motion.div
        className="flex items-center space-x-2 text-[#4E7BFF] relative z-10"
        initial={{ x: 0 }}
        whileHover={{ x: 5 }}
      >
        <span className="text-sm">Learn more</span>
        <ArrowRight size={16} />
      </motion.div>

      {/* Geometric decoration */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#4E7BFF]/5 rounded-full blur-3xl group-hover:bg-[#4E7BFF]/10 transition-all duration-500" />
    </motion.div>
  );
}
