'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';


export default function TimeTracker({ className = '' }: { className?: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('trackerTime');
    if (saved) setSeconds(Number(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('trackerTime', String(seconds));
  }, [seconds]);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
    localStorage.removeItem('trackerTime');
  }

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isRunning]);

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return [hrs, mins, secs]
      .map((v) => String(v).padStart(2, '0'))
      .join(':');
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-[--border] p-5 ${className} flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[--foreground]">Time Tracker</h2>
        <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isRunning ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
          {isRunning ? 'Running' : 'Paused'}
        </span>
      </div>

      <div className="text-center py-2">
        <p className="text-4xl font-mono font-bold text-[--foreground] tracking-wider tabular-nums">
          {formatTime(seconds)}
        </p>
        <p className="text-xs text-[--muted-foreground] mt-1">hrs : min : sec</p>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={toggleTimer}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl gradient-brand text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {isRunning ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Start</>}
        </button>
        <button
          onClick={resetTimer}
          disabled={seconds === 0}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[--background] border border-[--border] text-[--muted-foreground] hover:text-[--foreground] hover:border-[--ring] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  )
}
