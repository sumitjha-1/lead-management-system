import Lead from '../models/Lead.js';
import User from '../models/User.js';
import { logActivity } from '../services/activityService.js';

// ----------------------------------------------------------------------
// Part A: Public Capture + Create (Admin)
// ----------------------------------------------------------------------

// @desc    Public lead capture (no auth)
// @route   POST /api/leads/public
// @access  Public
export const createPublicLead = async (req, res) => {
  try {
    const { fullName, email, phone, company, leadSource, message } = req.body;

    const lead = await Lead.create({
      fullName,
      email,
      phone,
      company,
      leadSource,
      message,
      status: 'New',
      statusHistory: [{ status: 'New', changedBy: null, changedAt: new Date() }],
      createdBy: null
    });

    // Public response never exposes internal lead data
    res.status(201).json({
      success: true,
      message: 'Thank you! Your information has been submitted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Admin creates a lead manually
// @route   POST /api/leads
// @access  Private/Admin
export const createLead = async (req, res) => {
  try {
    const { fullName, email, phone, company, leadSource, message } = req.body;

    const lead = await Lead.create({
      fullName,
      email,
      phone,
      company,
      leadSource,
      message,
      status: 'New',
      statusHistory: [{ status: 'New', changedBy: req.user._id, changedAt: new Date() }],
      createdBy: req.user._id
    });

    await logActivity({
      userId: req.user._id,
      action: `Lead Created: ${lead.fullName}`,
      leadId: lead._id
    });

    res.status(201).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ----------------------------------------------------------------------
// Part B: Get Leads (Admin: all, with search/filter/pagination |
//         Member: assigned only)
// ----------------------------------------------------------------------

// @desc    Get leads (Admin: all leads w/ search+filter+pagination |
//         Member: only assigned leads)
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
  try {
    const {
      search,
      status,
      assignedTo,
      leadSource,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Member restriction: can only see their own assigned leads
    if (req.user.role === 'member') {
      query.assignedTo = req.user._id;
    } else if (assignedTo) {
      // Admin can filter by a specific member
      query.assignedTo = assignedTo;
    }

    if (status) {
      query.status = status;
    }

    if (leadSource) {
      query.leadSource = leadSource;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: leads.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      leads
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single lead by ID (with access check)
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('statusHistory.changedBy', 'name')
      .populate('assignmentHistory.assignedTo', 'name')
      .populate('assignmentHistory.assignedBy', 'name');

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Member restriction: cannot view a lead that isn't assigned to them
    if (
      req.user.role === 'member' &&
      (!lead.assignedTo || !lead.assignedTo._id.equals(req.user._id))
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this lead' });
    }

    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ----------------------------------------------------------------------
// Part C: Update, Assign, Status Change, Delete
// ----------------------------------------------------------------------

// @desc    Update lead details (Admin only)
// @route   PUT /api/leads/:id
// @access  Private/Admin
export const updateLead = async (req, res) => {
  try {
    const { fullName, email, phone, company, leadSource, message } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Only update fields that are explicitly provided
    lead.fullName = fullName ?? lead.fullName;
    lead.email = email ?? lead.email;
    lead.phone = phone ?? lead.phone;
    lead.company = company ?? lead.company;
    lead.leadSource = leadSource ?? lead.leadSource;
    lead.message = message ?? lead.message;

    await lead.save();

    await logActivity({
      userId: req.user._id,
      action: `Lead Updated: ${lead.fullName}`,
      leadId: lead._id
    });

    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Assign or reassign a lead to a member (Admin only)
// @route   PUT /api/leads/:id/assign
// @access  Private/Admin
export const assignLead = async (req, res) => {
  try {
    const { memberId } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const member = await User.findOne({ _id: memberId, role: 'member', isActive: true });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found or inactive' });
    }

    lead.assignedTo = member._id;
    lead.assignmentHistory.push({
      assignedTo: member._id,
      assignedBy: req.user._id,
      assignedAt: new Date()
    });

    await lead.save();

    await logActivity({
      userId: req.user._id,
      action: `Lead Assigned to ${member.name}: ${lead.fullName}`,
      leadId: lead._id
    });

    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update lead status (Admin + Member, if member owns the lead)
// @route   PUT /api/leads/:id/status
// @access  Private
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Member restriction: can only update status of leads assigned to them
    if (
      req.user.role === 'member' &&
      (!lead.assignedTo || !lead.assignedTo.equals(req.user._id))
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this lead' });
    }

    lead.status = status;
    lead.statusHistory.push({
      status,
      changedBy: req.user._id,
      changedAt: new Date()
    });

    await lead.save();

    await logActivity({
      userId: req.user._id,
      action: `Status Changed to '${status}': ${lead.fullName}`,
      leadId: lead._id
    });

    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete a lead (Admin only)
// @route   DELETE /api/leads/:id
// @access  Private/Admin
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await lead.deleteOne();

    await logActivity({
      userId: req.user._id,
      action: `Lead Deleted: ${lead.fullName}`
    });

    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};