import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center transition-all rounded-lg relative overflow-hidden group';
  
  const variants = {
    primary: `bg-gradient-to-r from-[#4E7BFF] to-[#6B8FFF] text-white hover:shadow-lg hover:shadow-[#4E7BFF]/30 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    secondary: `bg-white/5 text-blue-600 border border-[#4E7BFF]/20 hover:bg-white/10 hover:border-[#4E7BFF]/40 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    outline: `border-2 border-[#4E7BFF] text-[#4E7BFF] hover:bg-[#4E7BFF]/10 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
    subtle: `text-[#A9B3C9] hover:text-white hover:bg-white/5 ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && !disabled && (
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
}
