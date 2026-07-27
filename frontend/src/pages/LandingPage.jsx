import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiUsers, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import { submitPublicLead } from '../api/leads';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

const initialForm = {
  fullName: '', email: '', phone: '', company: '', leadSource: '', message: ''
};

const LandingPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.leadSource.trim()) e.leadSource = 'Please select a lead source';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setApiError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitPublicLead(form);
      setSuccess(true);
      setForm(initialForm);
    } catch (error) {
      setApiError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-lg">
          <FiTrendingUp className="text-primary" size={22} />
          LeadFlow
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="px-4 py-2 rounded-brand bg-primary hover:bg-primary-hover text-white text-sm font-medium">
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Manage Your Leads. Close More Deals.
        </h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
          A simple, powerful lead management system for growing teams.
        </p>
        <a href="#lead-form" className="inline-block px-6 py-3 rounded-brand bg-primary hover:bg-primary-hover text-white font-medium">
          Get Started
        </a>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 pb-20">
        {[
          { icon: FiUsers, title: 'Lead Assignment', desc: 'Assign and track leads across your team.' },
          { icon: FiBarChart2, title: 'Real-Time Dashboard', desc: 'See stats and activity as they happen.' },
          { icon: FiCheckCircle, title: 'Status Pipeline', desc: 'Move leads from New to Won with full history.' }
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-card border border-border rounded-brand p-6">
            <Icon className="text-primary mb-3" size={24} />
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-text-secondary text-sm">{desc}</p>
          </div>
        ))}
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="max-w-xl mx-auto px-4 pb-20">
        <div className="bg-card border border-border rounded-brand p-8">
          <h2 className="text-2xl font-bold mb-2">Get In Touch</h2>
          <p className="text-text-secondary text-sm mb-6">Fill out the form and our team will reach out.</p>

          {success ? (
            <div className="px-4 py-3 rounded-brand bg-success/10 border border-success text-success text-sm">
              Thank you! Your information has been submitted successfully.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {apiError && (
                <div className="px-4 py-3 rounded-brand bg-danger/10 border border-danger text-danger text-sm">
                  {apiError}
                </div>
              )}

              <div>
                <input
                  name="fullName" value={form.fullName} onChange={handleChange}
                  placeholder="Full Name"
                  className={`w-full px-3 py-2.5 rounded-brand border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.fullName ? 'border-danger' : 'border-border'}`}
                />
                {errors.fullName && <p className="text-danger text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <input
                  name="email" value={form.email} onChange={handleChange}
                  placeholder="Email"
                  className={`w-full px-3 py-2.5 rounded-brand border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-danger' : 'border-border'}`}
                />
                {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  name="phone" value={form.phone} onChange={handleChange}
                  placeholder="Phone Number"
                  className={`w-full px-3 py-2.5 rounded-brand border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-danger' : 'border-border'}`}
                />
                {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
              </div>

              <input
                name="company" value={form.company} onChange={handleChange}
                placeholder="Company (optional)"
                className="w-full px-3 py-2.5 rounded-brand border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div>
                <select
                  name="leadSource" value={form.leadSource} onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-brand border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.leadSource ? 'border-danger' : 'border-border'}`}
                >
                  <option value="">Select Lead Source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Other">Other</option>
                </select>
                {errors.leadSource && <p className="text-danger text-xs mt-1">{errors.leadSource}</p>}
              </div>

              <textarea
                name="message" value={form.message} onChange={handleChange}
                placeholder="Message (optional)" rows={4}
                className="w-full px-3 py-2.5 rounded-brand border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="submit" disabled={submitting}
                className="w-full py-2.5 rounded-brand bg-primary hover:bg-primary-hover text-white font-medium text-sm disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* AI Disclosure */}
      <section className="max-w-2xl mx-auto px-4 pb-12 text-center">
        <p className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-text-primary">A note on AI usage:</strong> This project was built with AI assistance (Claude) for scaffolding the backend architecture, React components, and boilerplate code. I reviewed and tested each part manually, made corrections to routing, access-control logic, and data flow where needed, and verified all authentication and permission rules against the actual API before deployment.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;