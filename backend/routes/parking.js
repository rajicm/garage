const express = require('express');
const db = require('../database/db');

const router = express.Router();


// Add a parking record
router.post('/', (req, res) => {
  const { userId, date } = req.body;

  const query = `INSERT INTO Parking (userId, date) VALUES (?, ?, ?)`;
  db.run(query, [userId, date], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});



// Delete a parking record
router.delete('/:parkingId', (req, res) => {
  const { parkingId } = req.params;

  db.run('DELETE FROM parking WHERE parkingId = ?', parkingId, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete parking record', details: err.message });
    }
    res.json({ message: 'Parking record deleted', changes: this.changes });
  });
});

module.exports = router;
