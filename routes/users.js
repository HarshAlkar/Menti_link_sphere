const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Fetch all users
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Signup endpoint with email verification
router.post('/signup', async (req, res) => {
  const { username, password, email, is_mentor, is_student, profile_picture, bio } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password, and email are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (username, password_hash, email, is_mentor, is_student, profile_picture, bio, is_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [username, hashedPassword, email, is_mentor || false, is_student || false, profile_picture || null, bio || null, false],
      (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Failed to register user' });
        }
        // Send verification email
        const token = jwt.sign({ id: results.insertId, email }, JWT_SECRET, { expiresIn: '1d' });
        const verifyUrl = `${req.protocol}://${req.get('host')}/api/users/verify-email?token=${token}`;
        transporter.sendMail({
          from: EMAIL_USER,
          to: email,
          subject: 'Verify your email',
          html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
        });
        res.status(201).json({ message: 'User registered. Verification email sent.', id: results.insertId });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Email verification endpoint
router.get('/verify-email', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('No token provided');
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).send('Invalid or expired token');
    db.query('UPDATE users SET is_verified = ? WHERE id = ?', [true, decoded.id], (err2) => {
      if (err2) return res.status(500).send('Database error');
      res.send('Email verified successfully!');
    });
  });
});

// Send verification email (for logged-in users)
router.post('/send-verification', authenticateToken, (req, res) => {
  const { email } = req.user;
  const token = jwt.sign({ id: req.user.id, email }, JWT_SECRET, { expiresIn: '1d' });
  const verifyUrl = `${req.protocol}://${req.get('host')}/api/users/verify-email?token=${token}`;
  transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
  });
  res.json({ message: 'Verification email sent.' });
});

// Request password reset
router.post('/request-password-reset', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'No user with that email' });
    const user = results[0];
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '1h' });
    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/reset-password?token=${token}`;
    transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    });
    res.json({ message: 'Password reset email sent.' });
  });
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(400).json({ error: 'Invalid or expired token' });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, decoded.id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Password reset successful' });
    });
  });
});

// Login endpoint with JWT
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Create JWT token
    const token = jwt.sign({ id: user.id, username: user.username, is_mentor: user.is_mentor, is_student: user.is_student, email: user.email, is_verified: user.is_verified }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, is_mentor: user.is_mentor, is_student: user.is_student, email: user.email, is_verified: user.is_verified } });
  });
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Get current user info (protected route)
router.get('/me', authenticateToken, (req, res) => {
  db.query('SELECT id, username, is_mentor, is_student, email, is_verified, profile_picture, bio, created_at, updated_at FROM users WHERE id = ?', [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(results[0]);
  });
});

// Add a new user (legacy, not for signup)
router.post('/add', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO users (username, email) VALUES (?, ?)', [name, email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add user' });
    }
    res.status(201).json({ id: results.insertId, name, email });
  });
});

module.exports = router;
