import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ message = 'No data found' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
    <FiInbox size={36} className="mb-3 opacity-50" />
    <p className="text-sm">{message}</p>
  </div>
);

export default EmptyState;