import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLeadById, updateLead } from '../api/leads';
import LeadForm from '../components/LeadForm';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getLeadById(id)
      .then(({ data }) => {
        const { fullName, email, phone, company, leadSource, message } = data.lead;
        setInitialData({ fullName, email, phone, company: company || '', leadSource, message: message || '' });
      })
      .catch(() => showToast('Failed to load lead', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    try {
      await updateLead(id, form);
      showToast('Lead updated successfully');
      navigate(`/admin/leads/${id}`);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update lead', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Lead</h1>
      <LeadForm initialData={initialData} onSubmit={handleSubmit} submitting={submitting} submitLabel="Update Lead" />
    </div>
  );
};

export default EditLead;