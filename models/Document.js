
import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL returned by Cloudinary
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  },
  depots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Depot' }],
  userId: { type: String, required: true },
});

const Document = mongoose.model('Document', DocumentSchema);
export default Document;
