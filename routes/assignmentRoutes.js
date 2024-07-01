import express from 'express';
import { submitAssignment } from '../controllers/assignmentController.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

router.post('/:assignmentId/submit', upload.single('file'), submitAssignment);

export default router;
