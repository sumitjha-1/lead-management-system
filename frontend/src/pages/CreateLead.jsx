import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLead } from '../api/leads';
import LeadForm from '../components/LeadForm';
import { useToast } from '../context/ToastContext';

const CreateLead = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      await createLead(form);
      showToast('Lead created successfully');
      navigate('/admin/leads');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create lead', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Create Lead</h1>
      <LeadForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Create Lead" />
    </div>
  );
};

export default CreateLead;