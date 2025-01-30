const bcrypt = require('bcrypt');
const db = require('../database/db');

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) return res.status(500).json({ error: 'User registration failed', details: err.message });
    res.status(201).json({ message: 'User registered successfully' });
  });
};

const loginUser = (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid password' });

    res.json({ message: 'Login successful' });
  });
};

module.exports = { registerUser, loginUser };
