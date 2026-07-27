import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="pl-9 pr-3 py-2 rounded-brand border border-border bg-card text-text-primary text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
);

export default SearchBar;