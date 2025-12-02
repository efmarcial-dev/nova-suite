import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface CaseStudyCardProps {
  company: string;
  industry: string;
  problem: string;
  solution: string;
  results: { label: string; value: string }[];
  delay?: number;
}

export function CaseStudyCard({ company, industry, problem, solution, results, delay = 0 }: CaseStudyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-2xl p-8 lg:p-10 border border-[#4E7BFF]/10 hover:border-[#4E7BFF]/30 transition-all overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#4E7BFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(78, 123, 255, 0.05), transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(78, 123, 255, 0.05), transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(78, 123, 255, 0.05), transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Company & Industry */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="mb-2 text-black text-xl font-semibold">{company}</h3>
          <span className="text-sm text-[#4E7BFF] bg-[#4E7BFF]/10 px-3 py-1 rounded-full">
            {industry}
          </span>
        </div>
      </div>

      {/* Problem */}
      <div className="mb-6 relative z-10">
        <h4 className="text-[#4E7BFF] mb-2">Problem</h4>
        <p className="text-slate-500">{problem}</p>
      </div>

      {/* Solution */}
      <div className="mb-8 relative z-10">
        <h4 className="text-[#4E7BFF] mb-2">Solution</h4>
        <p className="text-slate-500">{solution}</p>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-6 mb-6 relative z-10">
        {results.map((result, index) => (
          <div key={index} className="text-center">
            <motion.div
              className="text-2xl lg:text-3xl mb-1 text-[#4E7BFF]"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.2 + index * 0.1, type: 'spring' }}
            >
              {result.value}
            </motion.div>
            <div className="text-sm text-[#A9B3C9]">{result.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        className="flex items-center space-x-2 text-[#4E7BFF] cursor-pointer relative z-10"
        whileHover={{ x: 5 }}
      >
        <span>View full case study</span>
        <ArrowRight size={18} />
      </motion.div>

      {/* Decorative element */}
      <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-[#4E7BFF]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
    </motion.div>
  );
}
