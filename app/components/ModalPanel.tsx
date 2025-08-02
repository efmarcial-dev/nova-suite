'use client';

import { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';


interface ModalPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  hasPills?: boolean;
}

export default function ModalPanel({ isOpen, onClose, hasPills, children }: ModalPanelProps) {

  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        setIsMounted(true);
    } else {
      setIsClosing(true);
      const timeout = setTimeout(() => {
        setIsClosing(false);
        setIsMounted(false);
      }, 300); // Match animation duration
    
      return () => clearTimeout(timeout);
    }

  }, [isOpen]);

  useEffect(() => {
    if (!hasPills && scrollRef.current) {
      scrollRef.current.scrollTo({top: 0})
    }
  }, [hasPills])
  

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
        setIsClosing(false);
        setIsMounted(false);
        onClose();
    }, 300); // Match this duration with your CSS animation duration
  }

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end ">
      {/* Overlay to close modal */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`relative bg-white rounded-xl shadow-2xl w-full max-w-xl h-[90vh] m-4 flex flex-col
          ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}
        `}
      >
        {/* Close button (absolute) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-sm z-10"
        >
          ✕
        </button>

        {/* Children (content + form) scrollable */}
        <div 
          ref={scrollRef}
          className={`flex-1 pt-6 px-6 pb-4 transition-all duration-300 ${
                      hasPills ? 'overflow-y-auto scrollbar-hide' : 'overflow-hidden'
                    }`}
        >
          {children}
        </div>
      </div>

    </div>
  );
}
