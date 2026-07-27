import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async ({ userId, action, leadId = null }) => {
  try {
    await ActivityLog.create({ user: userId, action, lead: leadId });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};