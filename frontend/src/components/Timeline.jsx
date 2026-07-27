const Timeline = ({ statusHistory, assignmentHistory }) => {
  const events = [
    ...statusHistory.map((s) => ({
      type: 'status',
      label: `Status changed to "${s.status}"`,
      by: s.changedBy?.name || 'System',
      date: s.changedAt
    })),
    ...assignmentHistory.map((a) => ({
      type: 'assignment',
      label: `Assigned to ${a.assignedTo?.name || 'someone'}`,
      by: a.assignedBy?.name || 'System',
      date: a.assignedAt
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (events.length === 0) {
    return <p className="text-sm text-text-secondary">No history yet.</p>;
  }

  return (
    <div className="space-y-4">
      {events.map((e, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
          <div>
            <p className="text-sm text-text-primary">{e.label}</p>
            <p className="text-xs text-text-secondary">by {e.by} • {new Date(e.date).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;