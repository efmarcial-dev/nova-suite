import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { Button } from '@/app/(public)/components/Button';
import { useRouter } from 'next/navigation';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$2,500',
    description: 'Perfect for small businesses starting their digital transformation',
    features: [
      'Custom website development',
      'Responsive design',
      'Basic SEO optimization',
      'Content management system',
      '30 days support',
      'Performance optimization',
    ],
  },
  {
    name: 'Professional',
    price: '$7,500',
    description: 'Ideal for growing businesses needing advanced solutions',
    features: [
      'Everything in Starter',
      'Custom web application',
      'API development & integration',
      'Database design',
      'Advanced analytics',
      'E-commerce functionality',
      '90 days priority support',
      'Security audit',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large organizations',
    features: [
      'Everything in Professional',
      'AI & automation solutions',
      'Custom software development',
      'Cloud infrastructure setup',
      'DevOps & CI/CD pipeline',
      'Dedicated account manager',
      'Unlimited support',
      'SLA guarantee',
      'Training & documentation',
    ],
  },
];

export function PricingTable() {

    const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {tiers.map((tier, index) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -10 }}
          className={`relative rounded-2xl p-8 border transition-all ${
            tier.featured
              ? 'bg-gradient-to-br from-blue-100 to-blue-300 border-[#4E7BFF]/50 shadow-xl shadow-[#4E7BFF]/20 scale-105'
              : 'bg-gradient-to-br from-white/5 to-transparent border-[#4E7BFF]/10 hover:border-[#4E7BFF]/30'
          }`}
        >
          {tier.featured && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-[#4E7BFF] to-[#6B8FFF] text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="mb-2 text-black font-semibold">{tier.name}</h3>
            <div className="flex items-baseline mb-2">
              <span className="text-4xl text-[#4E7BFF]">{tier.price}</span>
              {tier.price !== 'Custom' && <span className="text-gray-600 ml-2">/project</span>}
            </div>
            <p className="text-gray-600 text-sm">{tier.description}</p>
          </div>

          <ul className="space-y-3 mb-8">
            {tier.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
                className="flex items-start space-x-3"
              >
                <Check size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm font-semibold">{feature}</span>
              </motion.li>
            ))}
          </ul>

          <Button
            variant={tier.featured ? 'primary' : 'secondary'}
            className="w-full"
            onClick={() => router.push('/contact') }
          >
            Get Started
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
