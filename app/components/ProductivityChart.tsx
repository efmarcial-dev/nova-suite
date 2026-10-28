'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'

const weekData = [
  { day: 'Mon', tasks: 4, minutes: 120 },
  { day: 'Tue', tasks: 2, minutes: 90 },
  { day: 'Wed', tasks: 6, minutes: 150 },
  { day: 'Thu', tasks: 3, minutes: 60 },
  { day: 'Fri', tasks: 5, minutes: 180 },
  { day: 'Sat', tasks: 1, minutes: 45 },
  { day: 'Sun', tasks: 0, minutes: 0 },
]

const monthData = [
  { day: 'Wk 1', tasks: 18, minutes: 540 },
  { day: 'Wk 2', tasks: 22, minutes: 660 },
  { day: 'Wk 3', tasks: 15, minutes: 420 },
  { day: 'Wk 4', tasks: 28, minutes: 810 },
]

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[--border] rounded-xl shadow-lg px-4 py-2.5 text-sm">
        <p className="font-semibold text-[--foreground] mb-1">{label}</p>
        <p className="text-[#1EA0FF] font-medium">{payload[0].value} tasks completed</p>
      </div>
    );
  }
  return null;
}

export default function ProductivityChart({ className = '' }: { className?: string }) {
  const [range, setRange] = useState<'week' | 'month'>('week');
  const data = range === 'week' ? weekData : monthData;

  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border border-[--border] ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-[--foreground]">Task Completion Trend</h2>
          <p className="text-xs text-[--muted-foreground] mt-0.5">Tasks completed over time</p>
        </div>
        <div className="flex items-center gap-1 bg-[--background] rounded-lg p-1 border border-[--border]">
          {(['week', 'month'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                range === r
                  ? 'bg-white text-[#1EA0FF] shadow-sm border border-[--border]'
                  : 'text-[--muted-foreground] hover:text-[--foreground]'
              }`}
            >
              {r === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full" style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.003 264)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 260)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 260)' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="tasks"
              stroke="#4f46e5"
              strokeWidth={2.5}
              fill="url(#tasksGradient)"
              dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
