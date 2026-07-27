import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/auth';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { name };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      const { data } = await updateProfile(payload);
      showToast('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      window.location.reload(); // simplest way to refresh AuthContext's user state
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-brand border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="min-h-screen bg-background p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-6"
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="max-w-lg mx-auto bg-card border border-border rounded-brand p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">My Profile</h1>
        <p className="text-text-secondary text-sm mb-6">{user?.email} • <span className="capitalize">{user?.role}</span></p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-brand bg-danger/10 border border-danger text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <hr className="border-border" />

          <p className="text-sm font-medium text-text-primary">Change Password (optional)</p>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-brand bg-primary hover:bg-primary-hover text-white text-sm font-medium disabled:opacity-60"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;