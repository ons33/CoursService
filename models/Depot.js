// src/models/Depot.js
import mongoose from 'mongoose';

const DepotSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL to the submitted file
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
  createdAt: { type: Date, default: Date.now } ,
  userId: { type: String, required: true } // ID of the student who submitted the work

});

const Depot = mongoose.model('Depot', DepotSchema);
export default Depot;
