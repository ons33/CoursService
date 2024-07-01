import express from 'express';
import {
  createDepot,
  getDepots,
  getDepotById,
  updateDepot,
  deleteDepot,
} from '../controllers/depotController.js';

const router = express.Router();

router.post('/', createDepot);
router.get('/', getDepots);
router.get('/:depotId', getDepotById);
router.put('/:depotId', updateDepot);
router.delete('/:depotId', deleteDepot);

export default router;
