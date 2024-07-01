// app.js

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDataBase from "./config/MongoDb.js";
import coursRoutes from './routes/coursRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';
import depotRoutes from './routes/depotRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import AssignmentRoute from './routes/assignmentRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDataBase();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the uploads directory
app.use('/files', express.static('uploads'));

// Routes
app.use('/api/cours', coursRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/depot', depotRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/assignments', AssignmentRoute);

// Start the server
const PORT = process.env.PORT || 3007;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server; // Export the server instance for testing
