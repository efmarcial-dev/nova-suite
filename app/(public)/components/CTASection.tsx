import { motion } from 'motion/react';
import { Button } from './Button';

interface CTASectionProps {
  title: string;
  description: string;
  primaryButton?: { text: string; onClick: () => void };
  secondaryButton?: { text: string; onClick: () => void };
}

export function CTASection({ title, description, primaryButton, secondaryButton }: CTASectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-200/50"
    >
      {/* Background tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F9FF] via-white to-white pointer-events-none" />

      {/* Content */}
      <div className="relative px-5 py-10 sm:px-8 sm:py-14 lg:px-16 lg:py-20 text-center space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D1B2A] tracking-tight leading-tight"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {primaryButton && (
            <button
              type="button"
              onClick={primaryButton.onClick}
              className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl bg-[#1EA0FF] hover:bg-[#0088EE] text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {primaryButton.text}
            </button>
          )}
          {secondaryButton && (
            <button
              type="button"
              onClick={secondaryButton.onClick}
              className="w-full sm:w-auto px-6 sm:px-7 py-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition shadow-2xs cursor-pointer"
            >
              {secondaryButton.text}
            </button>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
