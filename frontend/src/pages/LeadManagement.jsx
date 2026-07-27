import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiEdit2, FiEye } from 'react-icons/fi';
import { getLeads, deleteLead } from '../api/leads';
import { getUsers } from '../api/users';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../context/ToastContext';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Other'];

const LeadManagement = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [leads, setLeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getLeads({
        page,
        limit: 10,
        search,
        status,
        leadSource: source,
        assignedTo
      });
      setLeads(data.leads);
      setTotalPages(data.totalPages);
    } catch (error) {
      showToast('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, status, source, assignedTo]);

  useEffect(() => {
    getUsers().then(({ data }) =>
      setMembers(data.users.filter((u) => u.role === 'member'))
    );
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [search, status, source, assignedTo]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLead(deleteTarget._id);
      showToast('Lead deleted successfully');
      setDeleteTarget(null);
      fetchLeads();
    } catch (error) {
      showToast('Failed to delete lead', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Lead Management</h1>
        <button
          onClick={() => navigate('/admin/leads/create')}
          className="flex items-center gap-2 px-4 py-2 rounded-brand bg-primary hover:bg-primary-hover text-white text-sm font-medium"
        >
          <FiPlus size={16} /> Create Lead
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search name, email, phone, company..."
        />
        <FilterDropdown
          label="All Statuses"
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
        />
        <FilterDropdown
          label="All Sources"
          value={source}
          onChange={setSource}
          options={SOURCE_OPTIONS}
        />
        <FilterDropdown
          label="All Members"
          value={assignedTo}
          onChange={setAssignedTo}
          options={members.map((m) => ({ label: m.name, value: m._id }))}
        />
      </div>

      <div className="bg-card border border-border rounded-brand overflow-hidden">
        {loading ? (
          <Loader />
        ) : leads.length === 0 ? (
          <EmptyState message="No leads found" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-background text-text-secondary text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Assigned To</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-t border-border">
                  <td className="px-4 py-3 text-text-primary font-medium">
                    {lead.fullName}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {lead.company || '—'}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {lead.leadSource}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {lead.assignedTo?.name || 'Unassigned'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/leads/${lead._id}`)}
                        className="p-1.5 rounded-brand hover:bg-background text-text-secondary"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/leads/${lead._id}/edit`)}
                        className="p-1.5 rounded-brand hover:bg-background text-text-secondary"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(lead)}
                        className="p-1.5 rounded-brand hover:bg-background text-danger"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteTarget?.fullName}"? This cannot be undone.`}
      />
    </div>
  );
};

export default LeadManagement;