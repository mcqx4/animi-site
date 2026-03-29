const express = require('express');
const router = express.Router();
const { getDatabase } = require('../db/database');
const telegram = require('../services/telegram');

// POST /api/orders — create a new order
router.post('/', async (req, res, next) => {
  try {
    const {
      type,
      customer_name,
      customer_email,
      customer_phone,
      product_id,
      product_title,
      child_name,
      child_gender,
      format,
      total,
      notes,
    } = req.body;

    // Validate required fields
    if (!type || !customer_name || !customer_email) {
      return res.status(400).json({
        error: 'Missing required fields: type, customer_name, customer_email',
      });
    }

    const validTypes = ['book', 'cartoon', 'personal_cartoon', 'personal_book', 'personal_audio'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    const order_number = `ANM-${Date.now().toString(36).toUpperCase()}`;

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO orders (order_number, type, product_id, product_title, customer_name, customer_phone, customer_email, child_name, child_gender, format, total, notes)
      VALUES (@order_number, @type, @product_id, @product_title, @customer_name, @customer_phone, @customer_email, @child_name, @child_gender, @format, @total, @notes)
    `);

    stmt.run({
      order_number,
      type,
      product_id: product_id || null,
      product_title: product_title || null,
      customer_name,
      customer_phone: customer_phone || null,
      customer_email,
      child_name: child_name || null,
      child_gender: child_gender || null,
      format: format || null,
      total: total || null,
      notes: notes || null,
    });

    // Send Telegram notification (non-blocking)
    telegram.notifyNewOrder({
      order_number,
      type,
      product_title,
      format,
      total,
      customer_name,
      customer_phone,
      customer_email,
      child_name,
      child_gender,
    }).catch(err => console.error('[Telegram] notifyNewOrder failed:', err.message));

    res.json({ success: true, order_number });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
