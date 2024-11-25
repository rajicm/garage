const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO Users (username, password, email) VALUES (?, ?, ?)`;
    db.run(query, [username, hashedPassword, email], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    });
  } catch (err) {
    res.status(500).send('Error registering user: ' + err.message);
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM Users WHERE username = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      res.status(500).send('Error logging in: ' + err.message);
    } else if (!user) {
      res.status(404).send('User not found');
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).send('Invalid password');
      } else {
        res.status(200).json({ id: user.id, username: user.username });
      }
    }
  });
});

module.exports = router;
