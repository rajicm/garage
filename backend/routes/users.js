const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  res.send('Users route is working');
});

router.post('/register', (req, res) => {
  const { username, password, email } = req.body;

   if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required.' });
  }

  const sql = `INSERT INTO Users (username, password, email) VALUES (?, ?, ?)`;
  db.run(sql, [username, password, email], function(err) {
    if (err) {
      console.error('Error inserting user:', err.message);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).json({
      id: this.lastID,
      username,
      email
    });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = `SELECT * FROM Users WHERE email = ? AND password = ?`;
  db.get(sql, [email, password], (err, row) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!row) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If credentials are correct, return user data or token
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: row.id,
        username: row.username,
        email: row.email
      }
    });
  });
});

module.exports = router;
