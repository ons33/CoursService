// src/controllers/sectionController.js
import Section from '../models/Section.js';
import Document from '../models/Document.js';
import Assignment from '../models/Assignnment.js';
import Depot from '../models/Depot.js';
import upload from '../config/cloudinary.js';
import Cours from '../models/Cours.js';
// create Section
export const createSection = async (req, res) => {
  try {
    const { title, description, coursId, userId, type, dueDate } = req.body;
    const section = new Section({
      title,
      description,
      cours: coursId,
      userId,
      type,
    });
    await section.save();

    if (type === 'devoir') {
      const assignment = new Assignment({
        title,
        description,
        dueDate,
        section: section._id,
        userId,
      });
      await assignment.save();
      section.assignments.push(assignment._id);
    } else {
      const file = req.file;
      const document = new Document({
        title,
        filename: file.filename,
        fileUrl: file.path,
        section: section._id,
        userId,
      });
      await document.save();
      section.documents.push(document._id);
    }
    await section.save();
    res.status(201).json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ message: 'Error creating section', error });
  }
};
// get Sections
export const getSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .populate('documents')
      .populate('submissions');
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sections', error });
  }
};
// get Section By Id
export const getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.sectionId)
      .populate('documents')
      .populate('submissions');
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching section', error });
  }
};
// update Section
export const updateSection = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const section = await Section.findByIdAndUpdate(
      req.params.sectionId,
      { title, description, type },
      { new: true }
    );
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating section', error });
  }
};
// delete Section
export const deleteSection = async (req, res) => {
  try {
    await Section.findByIdAndDelete(req.params.sectionId);
    res.status(204).json({ message: 'Section deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting section', error });
  }
};
// add Assignment To Section
export const addAssignmentToSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, description, dueDate, userId } = req.body;
    const assignment = new Assignment({
      title,
      description,
      dueDate,
      section: sectionId,
      userId,
    });
    await assignment.save();

    const section = await Section.findById(sectionId);
    section.assignments.push(assignment._id);
    await section.save();

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding assignment', error });
  }
};
// add Document To Section
export const addDocumentToSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, userId } = req.body;
    const file = req.file;

    if (!file) {
      console.error('File not found in request');
      return res.status(400).json({ message: 'File not found in request' });
    }

    const document = new Document({
      title,
      filename: file.filename,
      fileUrl: file.path,
      section: sectionId,
      userId,
    });
    await document.save();

    const section = await Section.findById(sectionId);
    section.documents.push(document._id);
    await section.save();

    res.status(201).json(document);
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({ message: 'Error adding document', error });
  }
};
// submit Assignment
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { userId, content } = req.body; // assuming content is the file content or link to the file
    const depot = new Depot({ content, document: assignmentId, userId });
    await depot.save();

    const assignment = await Assignment.findById(assignmentId);
    assignment.submissions.push(depot._id);
    await assignment.save();

    res.status(201).json(depot);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assignment', error });
  }
};
// create Section With Document
export const createSectionWithDocument = async (req, res) => {
  try {
    const { title, description, type, cours, userId, dueDate } = req.body;
    const file = req.file;

    if (!file) {
      console.error('File not found in request');
      return res.status(400).json({ message: 'File not found in request' });
    }

    // Create a new section
    const section = new Section({
      title,
      description,
      type,
      cours,
      userId,
      dueDate,
    });
    await section.save();

    let document;
    if (type === 'documentation') {
      document = new Document({
        title,
        filename: file.filename,
        fileUrl: file.path,
        section: section._id,
        userId,
      });
      section.documents.push(document._id); // Link document to section
    } else if (type === 'devoir') {
      document = new Document({
        title,
        filename: file.filename,
        fileUrl: file.path,
        section: section._id,
        userId,
      });
      section.documents.push(document._id); // Link document to section
    }

    await document.save();
    await section.save();

    const coursToUpdate = await Cours.findById(cours);
    coursToUpdate.sections.push(section._id);
    await coursToUpdate.save();

    res.status(201).json(section);
  } catch (error) {
    console.error('Error creating section and adding document:', error);
    res
      .status(500)
      .json({ message: 'Error creating section and adding document', error });
  }
};
// get Submissions By SectionId
export const getSubmissionsBySectionId = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const submissions = await Depot.find({ section: sectionId });
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions', error });
  }
};
