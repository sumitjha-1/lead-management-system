import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeads } from '../api/leads';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const MyLeads = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getLeads({ page, limit: 10, search, status });
      setLeads(data.leads);
      setTotalPages(data.totalPages);
    } catch (error) {
      showToast('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { setPage(1); }, [search, status]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">My Leads</h1>

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search name, email, phone, company..." />
        <FilterDropdown label="All Statuses" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
      </div>

      <div className="bg-card border border-border rounded-brand overflow-hidden">
        {loading ? (
          <Loader />
        ) : leads.length === 0 ? (
          <EmptyState message="No leads assigned to you yet" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-background text-text-secondary text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-t border-border">
                  <td className="px-4 py-3 text-text-primary font-medium">{lead.fullName}</td>
                  <td className="px-4 py-3 text-text-secondary">{lead.company || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">{lead.leadSource}</td>
                  <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => navigate(`/member/leads/${lead._id}`)}
                      className="px-3 py-1.5 rounded-brand border border-border text-text-primary text-xs font-medium hover:bg-background"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default MyLeads;