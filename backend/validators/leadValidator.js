import { body } from 'express-validator';

export const createLeadValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('leadSource').trim().notEmpty().withMessage('Lead source is required'),
  body('company').optional().trim(),
  body('message').optional().trim()
];

export const updateLeadValidator = [
  body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('A valid email is required'),
  body('phone').optional().trim().notEmpty().withMessage('Phone cannot be empty'),
  body('leadSource').optional().trim().notEmpty().withMessage('Lead source cannot be empty'),
  body('company').optional().trim(),
  body('message').optional().trim()
];

export const updateStatusValidator = [
  body('status')
    .isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid status value')
];

export const assignLeadValidator = [
  body('memberId').isMongoId().withMessage('A valid member ID is required')
];