import Note from '../models/Note.js';
import Lead from '../models/Lead.js';
import { logActivity } from '../services/activityService.js';

// Shared helper: checks if the requesting user is allowed to touch this lead
const canAccessLead = (lead, user) => {
  if (user.role === 'admin') return true;
  return lead.assignedTo && lead.assignedTo.equals(user._id);
};

// @desc    Get all notes for a lead (chronological order)
// @route   GET /api/leads/:leadId/notes
// @access  Private
export const getNotesForLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (!canAccessLead(lead, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view notes for this lead' });
    }

    const notes = await Note.find({ lead: req.params.leadId })
      .populate('author', 'name role')
      .sort({ createdAt: 1 }); // chronological order, oldest first

    res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add a note to a lead
// @route   POST /api/leads/:leadId/notes
// @access  Private
export const createNote = async (req, res) => {
  try {
    const { message } = req.body;

    const lead = await Lead.findById(req.params.leadId);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (!canAccessLead(lead, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to add notes to this lead' });
    }

    const note = await Note.create({
      lead: lead._id,
      message,
      author: req.user._id
    });

    await note.populate('author', 'name role');

    await logActivity({
      userId: req.user._id,
      action: `Note Added: ${lead.fullName}`,
      leadId: lead._id
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};