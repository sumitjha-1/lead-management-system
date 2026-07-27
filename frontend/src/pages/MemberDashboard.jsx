import { useEffect, useState } from 'react';
import { FiUserCheck, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';
import { getLeads, getRecentActivities } from '../api/dashboard';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const MemberDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsRes, activitiesRes] = await Promise.all([
          getLeads({ limit: 5 }),
          getRecentActivities()
        ]);
        setLeads(leadsRes.data.leads);
        setTotal(leadsRes.data.total);
        setActivities(activitiesRes.data.activities);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const newCount = leads.filter((l) => l.status === 'New' || l.status === 'Contacted').length;
  const wonCount = leads.filter((l) => l.status === 'Won').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon={FiUserCheck} label="Assigned Leads" value={total} />
        <StatCard icon={FiClock} label="Needs Follow-up" value={newCount} color="text-warning" />
        <StatCard icon={FiCheckCircle} label="Won" value={wonCount} color="text-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-brand p-5">
          <h2 className="font-semibold text-text-primary mb-4">Today's Tasks</h2>
          {leads.length === 0 ? (
            <EmptyState message="No leads assigned yet" />
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead._id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{lead.fullName}</p>
                    <p className="text-xs text-text-secondary">{lead.company || lead.email}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-brand p-5">
          <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <FiActivity size={16} /> Activity Feed
          </h2>
          {activities.length === 0 ? (
            <EmptyState message="No activity yet" />
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act._id} className="py-2 border-b border-border last:border-0">
                  <p className="text-sm text-text-primary">{act.action}</p>
                  <p className="text-xs text-text-secondary">{new Date(act.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;