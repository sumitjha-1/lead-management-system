import ActivityLog from '../models/ActivityLog.js';

// @desc    Get activity logs (Admin: all activity | Member: only their own actions)
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res) => {
  try {
    const { userId, leadId, startDate, endDate, page = 1, limit = 20 } = req.query;

    const query = {};

    // Member restriction: can only ever see their own actions, never other members' or admin's
    if (req.user.role === 'member') {
      query.user = req.user._id;
    } else if (userId) {
      // Admin can filter by a specific user
      query.user = userId;
    }

    if (leadId) {
      query.lead = leadId;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [activities, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('user', 'name role')
        .populate('lead', 'fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      ActivityLog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      activities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get recent activities for dashboard widgets (simple, no pagination)
// @route   GET /api/activities/recent
// @access  Private
export const getRecentActivities = async (req, res) => {
  try {
    const query = {};

    if (req.user.role === 'member') {
      query.user = req.user._id;
    }

    const activities = await ActivityLog.find(query)
      .populate('user', 'name role')
      .populate('lead', 'fullName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};