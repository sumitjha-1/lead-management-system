const StatCard = ({ icon: Icon, label, value, color = 'text-primary' }) => (
  <div className="bg-card border border-border rounded-brand p-5 flex items-center gap-4">
    <div className={`p-3 rounded-brand bg-background ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-text-secondary text-sm">{label}</p>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

export default StatCard;