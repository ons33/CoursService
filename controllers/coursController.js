// src/controllers/coursController.js
import Cours from '../models/Cours.js';
import Section from '../models/Section.js';
import Document from '../models/Document.js';
import Depot from '../models/Depot.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const createCours = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const token = crypto.randomBytes(16).toString('hex');  // Générer un jeton unique
    const cours = new Cours({ title, description, userId, token });
    await cours.save();
    res.status(201).json(cours);
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error });
  }
};

export const getCours = async (req, res) => {
  try {
    const cours = await Cours.find().populate('sections');
    res.status(200).json(cours);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};

export const getCoursById = async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.coursId)
      .populate('sections')
      .populate({
        path: 'sections',
        populate: { path: 'documents submissions' }  // Populate documents and assignments in sections
      });

    console.log(cours);  // Log the course to verify the output
    res.status(200).json(cours);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course', error });
  }
};

export const updateCours = async (req, res) => {
  try {
    const { title, description } = req.body;
    const cours = await Cours.findByIdAndUpdate(req.params.coursId, { title, description }, { new: true });
    res.status(200).json(cours);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error });
  }
};

export const deleteCours = async (req, res) => {
  try {
    await Cours.findByIdAndDelete(req.params.coursId);
    res.status(204).json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error });
  }
};
export const verifyTokenAndConfirmParticipation = async (req, res) => {
  try {
      const { coursId } = req.params;
      const { email, token } = req.body;

      const course = await Cours.findById(coursId);

      if (!course) {
          return res.status(404).json({ message: 'Cours not found' });
      }

      if (course.token !== token) {
          return res.status(400).json({ message: 'Invalid token' });
      }

      const participant = course.participants.find(part => part.email === email);

      if (!participant) {
          return res.status(400).json({ message: 'Email not registered in this course' });
      }

      participant.confirmer = true;
      await course.save();

      res.status(200).json({ message: 'Participation confirmed' });
  } catch (error) {
      res.status(500).json({ message: 'Error verifying token', error });
  }
};

export const inviteStudents = async (req, res) => {
  try {
    const { coursId } = req.params;

    const cours = await Cours.findById(coursId);
    console.log(cours);
    if (!cours) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'File not found' });
    }

    // Lire le fichier Excel
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const emails = xlsx.utils.sheet_to_json(sheet, { header: 1 }).flat();

    // Mettre à jour les participants du cours
    cours.participants = emails;
    await cours.save();

    // Configurer le transporteur d'email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Utilisez le service de votre choix
      auth: {
        user: 'votre-email@gmail.com',
        pass: 'votre-mot-de-passe'
      }
    });

    // Envoyer les invitations par email
    for (const email of emails) {
      const mailOptions = {
        from: 'votre-email@gmail.com',
        to: email,
        subject: `Invitation to join the course ${cours.title}`,
        text: `You have been invited to join the course ${cours.title}. Use the following token to join: ${cours.token}`
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: 'Invitations sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error inviting students', error });
  }
};


export const addSectionToCours = async (req, res) => {
  try {
    const { title, description, type, userId } = req.body;
    const { coursId } = req.params;

    const section = new Section({ title, description, type, cours: coursId, userId });
    await section.save();

    const cours = await Cours.findById(coursId);
    cours.sections.push(section._id);
    await cours.save();

    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error adding section', error });
  }
};
export const addDocumentToSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { title, userId } = req.body;
    const file = req.file;

    // Log request data for debugging
    console.log("Request body:", req.body);
    console.log("Uploaded file:", file);

    // Ensure sectionId is correctly retrieved
    if (!sectionId) {
      return res.status(400).json({ message: 'sectionId is required' });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const document = new Document({
      title,
      filename: file.filename,
      fileUrl: file.path, // Cloudinary returns the file path in the `path` field
      section: sectionId,
      userId,
    });

    await document.save();

    section.documents.push(document._id);
    section.createdDate = new Date(); // Ajout du champ createdDate dans la section

    await section.save();

    res.status(201).json(document);
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({ message: 'Error adding document', error });
  }
};

export const participateInCourse = async (req, res) => {
  try {
    const { coursId, userId } = req.body;
    const cours = await Cours.findById(coursId);
    if (cours.participants.includes(userId)) {
      return res.status(400).json({ message: 'User already participating in the course' });
    }
    cours.participants.push(userId);
    await cours.save();
    res.status(200).json(cours);
  } catch (error) {
    res.status(500).json({ message: 'Error participating in course', error });
  }
};

import csv from 'csv-parser'; // Install this package
import fs from 'fs';
import XLSX from 'xlsx';



export const addParticipants = async (req, res) => {
  try {
    const { coursId } = req.params;
    const course = await Cours.findById(coursId);

    if (!course) {
      return res.status(404).json({ message: 'Cours not found' });
    }

    const participants = req.body.participants;

    participants.forEach(email => {
      course.participants.push({ email, confirmer: false });
    });

    await course.save();
    res.status(200).json({ message: 'Participants added successfully', participants: course.participants });
  } catch (error) {
    console.error('Error adding participants:', error);
    res.status(500).json({ message: 'Error adding participants', error: error.message });
  }
};


export const getCourseParticipants = async (req, res) => {
  try {
      const { coursId } = req.params;
      const course = await Cours.findById(coursId);

      if (!course) {
          return res.status(404).json({ message: 'Cours not found' });
      }

      res.status(200).json(course.participants);
  } catch (error) {
      console.error('Error fetching participants:', error);
      res.status(500).json({ message: 'Error fetching participants', error });
  }
};


export const sendInvitationEmails = async (req, res) => {
    try {
        const { coursId } = req.params;
        const { emails } = req.body;

        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'ons.benamorr@gmail.com',
            pass: 'balj ctus kuar ivbm',
          },
        });
        
        const course = await Cours.findById(coursId);

        if (!course) {
            return res.status(404).json({ message: 'Cours not found' });
        }

        const emailPromises = emails.map(email => {
          const mailOptions = {
              from: 'ons.benamorr@gmail.com',
              to: email,
              subject: 'Course Invitation',
              text: `Bonjour,

Vous êtes invité à rejoindre le cours ${course.title}. Utilisez le token suivant pour vous inscrire : ${course.token}.

Cordialement,
L'équipe Espritook`
          };

          return transporter.sendMail(mailOptions);
      });

        await Promise.all(emailPromises);

        res.status(200).json({ message: 'Invitations sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending invitations', error });
    }
};



export const enrollStudent = async (req, res) => {
  try {
    const { coursId } = req.params;
    const { token, email } = req.body;

    const course = await Cours.findById(coursId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.token !== token) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const participant = course.participants.find(p => p.email === email);

    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    if (participant.confirmer) {
      return res.status(400).json({ message: 'User already confirmed' });
    }

    participant.confirmer = true;
    await course.save();

    res.status(200).json({ message: 'Enrolled successfully', course });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Error enrolling student', error: error.message });
  }
};


// src/controllers/coursController.js

export const getCoursByUserId = async (req, res) => {
  console.log("hhhhhhhhhhh",req.params);

  try {
    const { userId } = req.params;

    // Fetch courses by userId (which is a string)
    const cours = await Cours.find({ userId }).populate('sections');
    if (!cours) {
      return res.status(404).json({ message: 'No courses found for this user' });
    }
    res.status(200).json(cours);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};
///hedhy l fonction d'invit
export const addParticipantsAndSendInvitations = async (req, res) => {
  try {
      const { coursId } = req.params;
      const course = await Cours.findById(coursId);

      if (!course) {
          return res.status(404).json({ message: 'Cours not found' });
      }

      const participants = JSON.parse(req.body.participants);

      if (!participants || participants.length === 0) {
          return res.status(400).json({ message: 'No participants provided' });
      }

      // Validate participants
      const validParticipants = participants.filter(p => p.email);
      if (validParticipants.length !== participants.length) {
          return res.status(400).json({ message: 'Some participants are missing email addresses' });
      }

      const emails = validParticipants.map(p => p.email);

      // Adding participants to the course
      validParticipants.forEach(({ email }) => {
          course.participants.push({ email, confirmer: false });
      });

      await course.save();

      // Sending invitation emails
      const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
              user: 'ons.benamorr@gmail.com',
              pass: 'balj ctus kuar ivbm',
          },
      });

      const emailPromises = emails.map(email => {
          const mailOptions = {
              from: 'ons.benamorr@gmail.com',
              to: email,
              subject: 'Course Invitation',
              text: `You are invited to join the course ${course.title}. Use the following token to join: ${course.token}`
          };

          return transporter.sendMail(mailOptions);
      });

      await Promise.all(emailPromises);

      res.status(200).json({ message: 'Participants added and invitations sent successfully', participants: course.participants });
  } catch (error) {
      console.error('Error adding participants and sending invitations:', error);
      res.status(500).json({ message: 'Error adding participants and sending invitations', error: error.message });
  }
};