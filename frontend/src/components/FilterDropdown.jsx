const FilterDropdown = ({ label, value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-2 rounded-brand border border-border bg-card text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
  >
    <option value="">{label}</option>
    {options.map((opt) =>
      typeof opt === 'string' ? (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ) : (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      )
    )}
  </select>
);

export default FilterDropdown;