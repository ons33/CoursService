// config/cloudinary.js



// src/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dpk9mpjsd',
    api_key: '348193888992711',
    api_secret: 'qefN7t3DU47Kdpnhi9i8G56XHM0'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'documents',
        format: async (req, file) => file.mimetype.split('/')[1], // Dynamically set format based on file type
        public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
    },
});

const upload = multer({ storage: storage });

export default upload;
