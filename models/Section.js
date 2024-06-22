// src/models/Section.js
import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true, enum: ['documentation', 'devoir'] },
  cours: { type: mongoose.Schema.Types.ObjectId, ref: 'Cours', required: true },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  dueDate: { type: Date },  // Add dueDate field
  createdAt: { type: Date, default: Date.now } ,
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Depot' }],
  userId: { type: String, required: true } // ID of the person who posted the section
});

const Section = mongoose.model('Section', SectionSchema);
export default Section;
