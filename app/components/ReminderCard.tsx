

export default function ReminderCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white p-10 rounded-xl shadow-sm ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Reminder</h2>
      <p className="text-sm text-gray-400">Placeholder content</p>
    </div>
  )
}