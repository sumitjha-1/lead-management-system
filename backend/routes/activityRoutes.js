import express from 'express';
import { getActivities, getRecentActivities } from '../controllers/activityController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getActivities);
router.get('/recent', getRecentActivities);

export default router;