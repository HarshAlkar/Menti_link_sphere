const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all mentors
router.get('/', (req, res) => {
  db.query('SELECT * FROM mentors', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Create a new mentor
router.post('/', (req, res) => {
  const { name, expertise, bio, email } = req.body;
  db.query(
    'INSERT INTO mentors (name, expertise, bio, email, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
    [name, expertise, bio, email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add mentor' });
      }
      res.status(201).json({ id: results.insertId, name, expertise, bio, email });
    }
  );
});

// Get a mentor by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM mentors WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Mentor not found' });
    }
    res.json(results[0]);
  });
});

// Update a mentor by ID
router.put('/:id', (req, res) => {
  const { name, expertise, bio, email } = req.body;
  db.query(
    'UPDATE mentors SET name = ?, expertise = ?, bio = ?, email = ?, updated_at = NOW() WHERE id = ?',
    [name, expertise, bio, email, req.params.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update mentor' });
      }
      res.json({ message: 'Mentor updated' });
    }
  );
});

// Delete a mentor by ID
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM mentors WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete mentor' });
    }
    res.json({ message: 'Mentor deleted' });
  });
});

module.exports = router; 