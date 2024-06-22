// src/config/multer.js
import multer from 'multer';

const storage = multer.memoryStorage(); // Use memory storage for simplicity

const uploadd = multer({ storage });

export default uploadd;