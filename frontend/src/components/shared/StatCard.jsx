const colorMap = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export default function StatCard({ title, value, icon, color = 'blue' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
