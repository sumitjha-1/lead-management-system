import express from 'express';
import { getNotesForLead, createNote } from '../controllers/noteController.js';
import { createNoteValidator } from '../validators/noteValidator.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = express.Router({ mergeParams: true });

router.get('/', getNotesForLead);
router.post('/', createNoteValidator, validateRequest, createNote);

export default router;