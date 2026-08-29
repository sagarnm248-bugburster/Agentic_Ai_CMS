const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  suggestCategory,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');


const router = express.Router();

const complaintValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description').notEmpty().withMessage('Description is required').trim(),
  body('category').notEmpty().withMessage('Category is required').trim(),
  body('location').notEmpty().withMessage('Location is required').trim(),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority level'),
  validate,
];

router.use(protect);

router.post('/', complaintValidation, createComplaint);
router.get('/', getComplaints);
router.post('/suggest-category', suggestCategory);
router.get('/:id', getComplaintById);
router.put('/:id', authorize('admin'), updateComplaint);
router.delete('/:id', authorize('admin'), deleteComplaint);

module.exports = router;


