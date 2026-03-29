const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/database');
const telegram = require('../services/telegram');

// POST /api/contacts — submit a contact form
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message, subject } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, message',
      });
    }

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (@name, @email, @subject, @message)
    `);

    stmt.run({
      name,
      email,
      subject: subject || null,
      message,
    });

    // Send Telegram notification (non-blocking)
    telegram.notifyNewContact({ name, email, subject, message })
      .catch(err => console.error('[Telegram] notifyNewContact failed:', err.message));

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
