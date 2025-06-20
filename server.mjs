import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/users.js';
import mentorRoutes from './routes/mentors.js';
import sessionRoutes from './routes/sessions.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/sessions', sessionRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', status: 'success' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
