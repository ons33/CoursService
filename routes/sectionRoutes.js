// src/routes/sectionRoutes.js
import express from 'express';
import {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection,
  addDocumentToSection,
  submitAssignment,
  getSubmissionsBySectionId, // Import the new controller function
  createSectionWithDocument,
} from '../controllers/sectionController.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.post('/', createSection);
router.get('/', getSections);
router.get('/:sectionId', getSectionById);
router.put('/:sectionId', updateSection);
router.delete('/:sectionId', deleteSection);
router.post('/create-with-document', upload.single('file'), createSectionWithDocument);
router.post('/assignments/:assignmentId/submit', upload.single('file'), submitAssignment);
router.get('/:sectionId/submissions', getSubmissionsBySectionId); // New route for fetching submissions

export default router;
