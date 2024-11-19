const express = require('express');
const db = require('../database/db');
const router = express.Router();

// Add a parking record
router.post('/', (req, res) => {
  const { vehicle_number, parking_spot, entry_time } = req.body;

  db.run(
    'INSERT INTO parking (vehicle_number, parking_spot, entry_time) VALUES (?, ?, ?)',
    [vehicle_number, parking_spot, entry_time],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add parking record', details: err.message });
      }
      res.status(201).json({ message: 'Parking record added', id: this.lastID });
    }
  );
});

// Get all parking records
router.get('/', (req, res) => {
  db.all('SELECT * FROM parking', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve parking records', details: err.message });
    }
    res.json(rows);
  });
});

// Update exit time for a parking record
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { exit_time } = req.body;

  db.run(
    'UPDATE parking SET exit_time = ? WHERE id = ?',
    [exit_time, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update parking record', details: err.message });
      }
      res.json({ message: 'Parking record updated', changes: this.changes });
    }
  );
});

// Delete a parking record
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM parking WHERE id = ?', id, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete parking record', details: err.message });
    }
    res.json({ message: 'Parking record deleted', changes: this.changes });
  });
});

module.exports = router;
