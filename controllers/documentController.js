import Document from '../models/Document.js';
import Depot from '../models/Depot.js';

export const createDocument = async (req, res) => {

};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate('depots');
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId).populate('depots');
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { title } = req.body;
    const document = await Document.findByIdAndUpdate(req.params.documentId, { title }, { new: true });
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.documentId);
    res.status(204).json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
};

export const addDepotToDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { content, userId } = req.body;
    const depot = new Depot({ content, document: documentId, userId });
    await depot.save();

    const document = await Document.findById(documentId);
    document.depots.push(depot._id);
    await document.save();

    res.status(201).json(depot);
  } catch (error) {
    res.status(500).json({ message: 'Error adding depot', error });
  }
};

export const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.redirect(document.fileUrl); // Redirect to the Cloudinary file URL
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while downloading the document' });
  }
};
