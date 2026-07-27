import express from 'express';

import { protect } from '../middlewares/authMiddleware.js';
import { login, logout, getMe, updateProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;