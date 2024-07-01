import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  },
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL returned by Cloudinary
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Depot' }],
  userId: { type: String, required: true },
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
