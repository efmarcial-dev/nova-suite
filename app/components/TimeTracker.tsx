'use client';
import { clear } from 'console';
import {useEffect, useRef, useState} from 'react';


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
  },[seconds]);

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);

  }

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
    localStorage.removeItem('trackerTime');
  }

  useEffect(()=> {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if(intervalRef.current)clearInterval(intervalRef.current);
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
    <div className={`bg-white rounded-xl shadow-sm ${className} flex flex-col items-center justify-center text-center h-full`}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Time Tracker</h2>
      <div className="text-3xl font-mono mb-4">{formatTime(seconds)}</div>


      <div className="flex gap-4">
        <button 
          onClick={toggleTimer}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Reset
        </button>
      </div>
    </div>
  )
}
