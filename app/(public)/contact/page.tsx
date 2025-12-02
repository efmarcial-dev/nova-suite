'use client'
import { motion } from 'motion/react';
import { useState } from 'react';
import { Input } from './components/Input';
import { Textarea } from './components/Textarea';
import { Button } from '../components/Button';
import { GeometricShape } from '../components/GeometricShape';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Simulate form submission
      console.log('Form submitted:', formData);
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          service: '',
          message: '',
        });
      }, 3000);
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: 'Email',
      detail: 'hello@novaitsolutions.com',
      link: 'mailto:hello@novaitsolutions.com',
    },
    {
      icon: <Phone size={24} />,
      title: 'Phone',
      detail: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Office',
      detail: '123 Tech Boulevard, San Francisco, CA 94105',
      link: 'https://maps.google.com',
    },
    {
      icon: <Clock size={24} />,
      title: 'Business Hours',
      detail: 'Mon - Fri: 9:00 AM - 6:00 PM PST',
      link: null,
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-32 px-6 lg:px-20 overflow-hidden">
        <GeometricShape variant="circle" size={400} className="absolute top-0 -right-40" />
        <GeometricShape variant="square" size={300} className="absolute bottom-0 -left-40" delay={2} />

        <div className="relative z-10 max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-[#4E7BFF]/10 border border-[#4E7BFF]/20 rounded-full text-[#4E7BFF] text-sm">
              Get In Touch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            Let's Build Something Amazing Together
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#DCE1EB] max-w-3xl mx-auto"
          >
            Ready to transform your business with cutting-edge technology? We're here to help. Schedule a free consultation today.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative p-6 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-[#4E7BFF]/10 hover:border-[#4E7BFF]/30 transition-all"
              >
                <div className="inline-flex p-3 rounded-lg bg-[#4E7BFF]/10 text-[#4E7BFF] mb-4">
                  {info.icon}
                </div>
                <h3 className="mb-2 text-lg">{info.title}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A9B3C9] hover:text-[#4E7BFF] transition-colors"
                  >
                    {info.detail}
                  </a>
                ) : (
                  <p className="text-[#A9B3C9]">{info.detail}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative px-6 lg:px-20 pb-32">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0E1A35] to-[#0A0F1F]" />
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `linear-gradient(rgba(78, 123, 255, 0.5) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(78, 123, 255, 0.5) 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
              }}
            />

            {/* Animated tech illustration */}
            <div className="absolute top-10 right-10 w-32 h-32 opacity-20">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                }}
                className="w-full h-full rounded-full border-2 border-[#4E7BFF]"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                }}
                className="absolute inset-0 w-full h-full rounded-full border-2 border-[#6B8FFF]"
              />
            </div>

            {/* Content */}
            <div className="relative p-8 lg:p-12">
              {!isSubmitted ? (
                <>
                  <h2 className="mb-8 text-center">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                      />
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Company Name"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                      />
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="relative">
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-[#4E7BFF]/20 hover:border-[#4E7BFF]/40 focus:border-[#4E7BFF] focus:shadow-lg focus:shadow-[#4E7BFF]/20 rounded-lg text-white focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#0A0F1F]">Select a Service</option>
                        <option value="ai-automation" className="bg-[#0A0F1F]">AI & Automation</option>
                        <option value="custom-software" className="bg-[#0A0F1F]">Custom Software</option>
                        <option value="web-development" className="bg-[#0A0F1F]">Web Development</option>
                        <option value="it-consulting" className="bg-[#0A0F1F]">IT Consulting</option>
                        <option value="other" className="bg-[#0A0F1F]">Other</option>
                      </select>
                      <label className="absolute -top-2 left-4 text-xs bg-[#0A0F1F] px-2 text-[#A9B3C9]">
                        Service Interested In
                      </label>
                    </div>

                    <Textarea
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      error={errors.message}
                      required
                      rows={6}
                    />

                    <Button type="submit" variant="primary" size="lg" className="w-full group">
                      Send Message
                      <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="inline-flex p-4 rounded-full bg-[#4E7BFF]/10 text-[#4E7BFF] mb-6"
                  >
                    <CheckCircle size={48} />
                  </motion.div>
                  <h2 className="mb-4">Message Sent Successfully!</h2>
                  <p className="text-xl text-[#DCE1EB]">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 lg:px-20 pb-32">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 lg:p-16 rounded-3xl bg-gradient-to-br from-[#4E7BFF]/10 to-transparent border border-[#4E7BFF]/20"
          >
            <h2 className="mb-6">Prefer to Talk Directly?</h2>
            <p className="text-xl text-[#DCE1EB] mb-8 max-w-2xl mx-auto">
              Schedule a free 30-minute consultation with our team to discuss your project.
            </p>
            <Button variant="primary" size="lg">
              Book Free Consultation
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
