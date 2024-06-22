// src/models/Cours.js
import mongoose from 'mongoose';

const CoursSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
  userId: { type: String, required: true }, // ID of the person who posted the course
  createdAt: { type: Date, default: Date.now },
  token: { type: String, required: true },  // Jeton unique pour chaque cours
  participants: [
    {
      email: { type: String, required: true },
      confirmer: { type: Boolean, default: false }
    }
  ] // List of participants with email and confirmation status
});

const Cours = mongoose.model('Cours', CoursSchema);
export default Cours;
