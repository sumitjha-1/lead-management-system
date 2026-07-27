import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Are you sure?', message, loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <p className="text-text-secondary text-sm mb-6">{message}</p>
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-brand border border-border text-text-primary text-sm font-medium hover:bg-background"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="px-4 py-2 rounded-brand bg-danger text-white text-sm font-medium hover:opacity-90 disabled:opacity-60"
      >
        {loading ? 'Please wait...' : 'Confirm'}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;