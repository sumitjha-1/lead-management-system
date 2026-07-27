import { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import UserForm from '../components/UserForm';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

const UserManagement = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(data.users);
    } catch (error) {
      showToast('Failed to load members', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async (form) => {
    setSubmitting(true);
    try {
      await createUser(form);
      showToast('Member created successfully');
      setCreateOpen(false);
      fetchUsers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (form) => {
    setSubmitting(true);
    try {
      const { name, email, role } = form;
      await updateUser(editTarget._id, { name, email, role });
      showToast('Member updated successfully');
      setEditTarget(null);
      fetchUsers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(deleteTarget._id);
      showToast('Member deleted successfully');
      setDeleteTarget(null);
      fetchUsers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete member', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-brand bg-primary hover:bg-primary-hover text-white text-sm font-medium"
        >
          <FiPlus size={16} /> Create Member
        </button>
      </div>

      <div className="bg-card border border-border rounded-brand overflow-hidden">
        {loading ? (
          <Loader />
        ) : users.length === 0 ? (
          <EmptyState message="No members found" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-background text-text-secondary text-left">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-border">
                  <td className="px-4 py-3 text-text-primary font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                  <td className="px-4 py-3 text-text-secondary capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditTarget(u)} className="p-1.5 rounded-brand hover:bg-background text-text-secondary">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(u)} className="p-1.5 rounded-brand hover:bg-background text-danger">
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

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create Member">
        <UserForm onSubmit={handleCreate} submitting={submitting} submitLabel="Create Member" />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Member">
        {editTarget && (
          <UserForm
            initialData={{ name: editTarget.name, email: editTarget.email, role: editTarget.role }}
            onSubmit={handleUpdate}
            submitting={submitting}
            submitLabel="Update Member"
            isEdit
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Member"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will deactivate their account.`}
      />
    </div>
  );
};

export default UserManagement;