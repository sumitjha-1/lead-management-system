import { useState } from 'react';

const SOURCE_OPTIONS = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Other'];

const LeadForm = ({ initialData, onSubmit, submitting, submitLabel = 'Save' }) => {
  const [form, setForm] = useState(
    initialData || { fullName: '', email: '', phone: '', company: '', leadSource: '', message: '' }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.leadSource.trim()) e.leadSource = 'Lead source is required';
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
        <input name="fullName" value={form.fullName} onChange={handleChange} className={inputClass('fullName')} />
        {errors.fullName && <p className="text-danger text-xs mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className={inputClass('email')} />
        {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Phone Number</label>
        <input name="phone" value={form.phone} onChange={handleChange} className={inputClass('phone')} />
        {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Company</label>
        <input name="company" value={form.company} onChange={handleChange} className={inputClass('company')} />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Lead Source</label>
        <select name="leadSource" value={form.leadSource} onChange={handleChange} className={inputClass('leadSource')}>
          <option value="">Select Lead Source</option>
          {SOURCE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.leadSource && <p className="text-danger text-xs mt-1">{errors.leadSource}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={4} className={inputClass('message')} />
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

export default LeadForm;