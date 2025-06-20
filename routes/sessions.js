const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Create a new video session (room)
router.post('/create', (req, res) => {
  const room = uuidv4();
  // Optionally, save session info to DB here
  res.json({ room });
});

module.exports = router; 