const statusStyles = {
  New: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  Contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  Qualified: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
  'Proposal Sent': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
  Won: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  Lost: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
};

const StatusBadge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || ''}`}>
    {status}
  </span>
);

export default StatusBadge;