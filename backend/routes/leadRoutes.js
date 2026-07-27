import express from 'express';
import {
  createPublicLead,
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  assignLead,
  updateLeadStatus,
  deleteLead
} from '../controllers/leadController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import {
  createLeadValidator,
  updateLeadValidator,
  updateStatusValidator,
  assignLeadValidator
} from '../validators/leadValidator.js';
import validateRequest from '../middlewares/validateRequest.js';
import noteRoutes from './noteRoutes.js';

const router = express.Router();

// Public route — no auth
router.post('/public', createLeadValidator, validateRequest, createPublicLead);

// All routes below require authentication
router.use(protect);

router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', authorize('admin'), createLeadValidator, validateRequest, createLead);
router.put('/:id', authorize('admin'), updateLeadValidator, validateRequest, updateLead);
router.put('/:id/assign', authorize('admin'), assignLeadValidator, validateRequest, assignLead);
router.put('/:id/status', updateStatusValidator, validateRequest, updateLeadStatus);
router.delete('/:id', authorize('admin'), deleteLead);
router.use('/:leadId/notes', noteRoutes);

export default router;