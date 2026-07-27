import { body } from 'express-validator';

export const createNoteValidator = [
  body('message').trim().notEmpty().withMessage('Note message is required')
];