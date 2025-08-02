'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts'

const data = [
  { day: 'Mon', tasks: 4, minutes: 120 },
  { day: 'Tue', tasks: 2, minutes: 90 },
  { day: 'Wed', tasks: 6, minutes: 150 },
  { day: 'Thu', tasks: 3, minutes: 60 },
  { day: 'Fri', tasks: 5, minutes: 180 },
  { day: 'Sat', tasks: 1, minutes: 45 },
  { day: 'Sun', tasks: 0, minutes: 0 }
]

export default function ProductivityChart({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-md ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Productivity List</h2>
      

      <div className="w-full" style={{height:'220px'}}>
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />

          <Tooltip />
          <Legend />

          {/* Minutes Bar */}
          {/* Tasks Bar */}
          <Bar yAxisId="left" dataKey="tasks" fill='#3b82f6' name="Tasks Completed" radius={[4, 4, 0, 0]}/>

          {/* Time Line */}
          <Line
            type="monotone"
            dataKey="tasks"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Tasks Completed"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            strokeDasharray="5 5" // ← makes the line dotted
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
      

    </div>
  )
}