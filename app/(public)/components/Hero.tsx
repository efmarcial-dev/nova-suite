'use client'
import { motion } from 'motion/react';
import { Button } from './Button';
import { ParticleField } from './ParticleField';
import { GeometricShape } from './GeometricShape';
import { ShieldCheck, Mail, Calendar, CheckSquare, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const pills = [
  { icon: Mail, label: 'Email Intelligence' },
  { icon: Calendar, label: 'Calendar Sync' },
  { icon: CheckSquare, label: 'Task Delegation' },
  { icon: Sparkles, label: 'AI Briefings' },
];

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex flex-col">
      <ParticleField />
      <GeometricShape variant="circle" size={400} className="absolute top-20 -left-40" delay={0} />
      <GeometricShape variant="square" size={250} className="absolute bottom-20 left-1/4" delay={4} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(78, 123, 255, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(78, 123, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 lg:px-20 relative z-10 py-24">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#4E7BFF]/10 border border-[#4E7BFF]/20 rounded-full text-[#4E7BFF] text-sm font-medium">
            <Sparkles size={14} />
            AI-Powered Executive Operating System
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 max-w-5xl mx-auto leading-tight tracking-tight text-gray-900"
        >
          One Dashboard.{' '}
          <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
            Every Intelligence
          </span>{' '}
          You Need to Lead.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed"
        >
          NovaSuite connects your Gmail or Outlook inbox, Google Calendar or Microsoft calendar, and task board into a single AI-powered workspace — so you spend less time managing and more time executing.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-base md:text-lg text-gray-500 italic mb-10 max-w-2xl mx-auto"
        >
          The AI helps you complete work — not just tell you what to do.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          {pills.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-xs"
            >
              <Icon size={13} className="text-indigo-500" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/register')}
            className="group"
          >
            Get Started Free →
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/login')}
          >
            Sign In to Dashboard
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-sm text-slate-400 mb-8"
        >
          Trusted by executives at growing teams · One-time lifetime access available
        </motion.p>

        {/* Privacy & Data Use Notice — required for Google OAuth app verification */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-slate-200 text-xs font-semibold text-slate-600 hover:text-indigo-700 hover:border-indigo-300 shadow-xs transition-colors"
          >
            <ShieldCheck size={13} className="text-indigo-600" />
            Privacy Policy
          </Link>
          <span className="text-xs text-slate-400 max-w-sm text-center">
            NovaSuite uses Google &amp; Microsoft OAuth to read your email and calendar — only to power your workspace. Your data is never sold.
          </span>
          <Link
            href="#data-transparency"
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            See exactly what we access →
          </Link>
        </motion.div>

      </div>
    </section>
  );
}