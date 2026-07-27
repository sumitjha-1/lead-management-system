import { useEffect, useState } from 'react';
import { FiUsers, FiTrendingUp, FiCheckCircle, FiClock } from 'react-icons/fi';
import { getLeads, getRecentActivities } from '../api/dashboard';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const AdminDashboard = () => {
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

  const wonCount = leads.filter((l) => l.status === 'Won').length;
  const newCount = leads.filter((l) => l.status === 'New').length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiUsers} label="Total Leads" value={total} />
        <StatCard icon={FiClock} label="New Leads" value={newCount} color="text-warning" />
        <StatCard icon={FiCheckCircle} label="Won Leads" value={wonCount} color="text-success" />
        <StatCard icon={FiTrendingUp} label="Activities Logged" value={activities.length} color="text-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-card border border-border rounded-brand p-5">
          <h2 className="font-semibold text-text-primary mb-4">Recent Leads</h2>
          {leads.length === 0 ? (
            <EmptyState message="No leads yet" />
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead._id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{lead.fullName}</p>
                    <p className="text-xs text-text-secondary">{lead.email}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-card border border-border rounded-brand p-5">
          <h2 className="font-semibold text-text-primary mb-4">Recent Activities</h2>
          {activities.length === 0 ? (
            <EmptyState message="No activity yet" />
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act._id} className="py-2 border-b border-border last:border-0">
                  <p className="text-sm text-text-primary">{act.action}</p>
                  <p className="text-xs text-text-secondary">
                    {act.user?.name} • {new Date(act.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;