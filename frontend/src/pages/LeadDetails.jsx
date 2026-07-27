import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getLeadById, assignLead, updateLeadStatus, getNotes, addNote } from '../api/leads';
import { getUsers } from '../api/users';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import NotesCard from '../components/NotesCard';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const LeadDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingNote, setAddingNote] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [leadRes, notesRes] = await Promise.all([getLeadById(id), getNotes(id)]);
      setLead(leadRes.data.lead);
      setNotes(notesRes.data.notes);
    } catch (error) {
      showToast('Failed to load lead', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
    // Only admins can fetch the member list for assignment
    if (user.role === 'admin') {
      getUsers().then(({ data }) =>
        setMembers(data.users.filter((u) => u.role === 'member' && u.isActive))
      );
    }
  }, [fetchAll]);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await updateLeadStatus(id, status);
      showToast('Status updated');
      fetchAll();
    } catch (error) {
      showToast('Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async (memberId) => {
    if (!memberId) return;
    setUpdating(true);
    try {
      await assignLead(id, memberId);
      showToast('Lead assigned');
      fetchAll();
    } catch (error) {
      showToast('Failed to assign lead', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (message) => {
    setAddingNote(true);
    try {
      await addNote(id, message);
      const { data } = await getNotes(id);
      setNotes(data.notes);
    } catch (error) {
      showToast('Failed to add note', 'error');
    } finally {
      setAddingNote(false);
    }
  };

  if (loading) return <Loader />;
  if (!lead) return <p className="text-text-secondary">Lead not found.</p>;

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{lead.fullName}</h1>
          <p className="text-text-secondary text-sm">{lead.email} • {lead.phone}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lead Info + Assignment (admin only) + Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-brand p-5">
            <h2 className="font-semibold text-text-primary mb-3">Lead Information</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-text-secondary">Company:</span> {lead.company || '—'}</p>
              <p><span className="text-text-secondary">Source:</span> {lead.leadSource}</p>
              <p><span className="text-text-secondary">Message:</span> {lead.message || '—'}</p>
              <p><span className="text-text-secondary">Created:</span> {new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {user.role === 'admin' && (
            <div className="bg-card border border-border rounded-brand p-5">
              <h2 className="font-semibold text-text-primary mb-3">Assigned Member</h2>
              <p className="text-sm text-text-primary mb-3">{lead.assignedTo?.name || 'Unassigned'}</p>
              <select
                onChange={(e) => handleAssign(e.target.value)}
                disabled={updating}
                value=""
                className="w-full px-3 py-2 rounded-brand border border-border bg-background text-text-primary text-sm"
              >
                <option value="">Reassign to...</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-card border border-border rounded-brand p-5">
            <h2 className="font-semibold text-text-primary mb-3">Update Status</h2>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="w-full px-3 py-2 rounded-brand border border-border bg-background text-text-primary text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Notes + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-brand p-5">
            <h2 className="font-semibold text-text-primary mb-3">Notes</h2>
            <NotesCard notes={notes} onAddNote={handleAddNote} adding={addingNote} />
          </div>

          <div className="bg-card border border-border rounded-brand p-5">
            <h2 className="font-semibold text-text-primary mb-3">Timeline</h2>
            <Timeline statusHistory={lead.statusHistory} assignmentHistory={lead.assignmentHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;