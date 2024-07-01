import express from 'express';
import {
  createCours,
  getCours,
  getCoursById,
  updateCours,
  deleteCours,
  addSectionToCours,
  participateInCourse,
  inviteStudents,
  verifyTokenAndConfirmParticipation,
  addParticipants,
  getCourseParticipants,
  sendInvitationEmails,
  getCoursByUserId,
} from '../controllers/coursController.js';
import uploadd from '../config/multer.js';

const router = express.Router();

router.post('/', createCours);
router.get('/', getCours);
router.get('/:coursId', getCoursById);
router.put('/:coursId', updateCours);
router.delete('/:coursId', deleteCours);
router.post('/:coursId/sections', addSectionToCours);
router.post('/:coursId/participate', participateInCourse);
router.post('/:coursId/invite', uploadd.single('file'), inviteStudents);
router.post('/:coursId/join', verifyTokenAndConfirmParticipation);
router.post(
  '/:coursId/add-participants',
  uploadd.single('file'),
  addParticipants
);

router.get('/:coursId/participants', getCourseParticipants);
router.post('/:coursId/send-invitations', sendInvitationEmails);
router.get('/user/:userId', getCoursByUserId); // Add this line

export default router;
