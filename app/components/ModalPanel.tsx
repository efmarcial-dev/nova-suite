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
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center">
      {/* Overlay to close modal */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`relative bg-white rounded-t-3xl sm:rounded-xl shadow-2xl w-full sm:max-w-xl h-[100dvh] sm:h-[90vh] m-0 sm:m-4 flex flex-col
          ${isClosing ? 'animate-slide-out-down sm:animate-slide-out-right' : 'animate-slide-in-up sm:animate-slide-in-right'}
        `}
      >
        {/* Close button (absolute) */}
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-[calc(.5rem+env(safe-area-inset-top))] right-3 flex h-11 w-11 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 text-sm z-10 sm:top-4 sm:right-4"
        >
          ✕
        </button>

        {/* Children (content + form) scrollable */}
        <div 
          ref={scrollRef}
          className="flex-1 pt-[calc(3.5rem+env(safe-area-inset-top))] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-y-auto transition-all duration-300 sm:pt-6 sm:px-6 sm:pb-4"
        >
          {children}
        </div>
      </div>

    </div>
  );
}
