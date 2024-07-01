import Assignment from '../models/Assignnment.js';
import Depot from '../models/Depot.js';
import Section from '../models/Section.js';

export const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, sectionId, userId } = req.body;
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
    res.status(500).json({ message: 'Error creating assignment', error });
  }
};
// get Submissions By SectionId
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { userId } = req.body;
    const file = req.file;

    if (!file) {
      console.error('File not found in request');
      return res.status(400).json({ message: 'File not found in request' });
    }

    const depot = new Depot({
      filename: file.filename,
      fileUrl: file.path,
      section: assignmentId, // Link to the section (assignment)
      userId,
    });
    await depot.save();

    const section = await Section.findById(assignmentId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.submissions.push(depot._id);
    await section.save();

    res.status(201).json(depot);
    console.log(depot);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ message: 'Error submitting assignment', error });
  }
};
