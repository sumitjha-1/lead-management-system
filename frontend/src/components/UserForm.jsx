import { useState } from 'react';

const UserForm = ({ initialData, onSubmit, submitting, submitLabel = 'Save', isEdit = false }) => {
  const [form, setForm] = useState(
    initialData || { name: '', email: '', password: '', role: 'member' }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!isEdit && (!form.password || form.password.length < 6)) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 rounded-brand border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
      errors[field] ? 'border-danger' : 'border-border'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className={inputClass('name')} />
        {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className={inputClass('email')} />
        {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
      </div>

      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} className={inputClass('password')} />
          {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Role</label>
        <select name="role" value={form.role} onChange={handleChange} className={inputClass('role')}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2.5 rounded-brand bg-primary hover:bg-primary-hover text-white text-sm font-medium disabled:opacity-60"
      >
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default UserForm;