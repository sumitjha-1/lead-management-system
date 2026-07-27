import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { createUserValidator, updateUserValidator } from '../validators/userValidator.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUserValidator, validateRequest, createUser);
router.put('/:id', updateUserValidator, validateRequest, updateUser);
router.delete('/:id', deleteUser);

export default router;