import { useState } from 'react';

const NotesCard = ({ notes, onAddNote, adding }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onAddNote(message);
    setMessage('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 px-3 py-2 rounded-brand border border-border bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={adding}
          className="px-4 py-2 rounded-brand bg-primary hover:bg-primary-hover text-white text-sm font-medium disabled:opacity-60"
        >
          Add
        </button>
      </form>

      {notes.length === 0 ? (
        <p className="text-sm text-text-secondary">No notes yet.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note._id} className="bg-background border border-border rounded-brand p-3">
              <p className="text-sm text-text-primary">{note.message}</p>
              <p className="text-xs text-text-secondary mt-1">
                {note.author?.name} ({note.author?.role}) • {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesCard;