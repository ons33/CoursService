import express from 'express';
import { createDocument, getDocuments, getDocumentById, updateDocument, deleteDocument, addDepotToDocument, downloadDocument } from '../controllers/documentController.js';

const router = express.Router();

router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:documentId', getDocumentById);
router.put('/:documentId', updateDocument);
router.delete('/:documentId', deleteDocument);
router.post('/:documentId/depots', addDepotToDocument);
router.get('/:documentId/download', downloadDocument);

export default router;
