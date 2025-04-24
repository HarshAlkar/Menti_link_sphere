const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch all users
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Add a new user
router.post('/add', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to add user' });
    }
    res.status(201).json({ id: results.insertId, name, email });
  });
});

module.exports = router;
