const express = require('express');
const router = express.Router();
const basicAuth = require('../middleware/auth');
const { getDatabase } = require('../db/database');

// All admin routes require authentication
router.use(basicAuth);

// ---------------------------------------------------------------------------
// GET /api/admin/stats — dashboard statistics
// ---------------------------------------------------------------------------
router.get('/stats', (req, res, next) => {
  try {
    const db = getDatabase();

    const totalBooks = db.prepare('SELECT COUNT(*) AS count FROM books').get().count;
    const totalCartoons = db.prepare('SELECT COUNT(*) AS count FROM cartoons').get().count;

    const totalOrders = db.prepare('SELECT COUNT(*) AS count FROM orders').get().count;
    const ordersNew = db.prepare("SELECT COUNT(*) AS count FROM orders WHERE status = 'new'").get().count;
    const ordersPaid = db.prepare("SELECT COUNT(*) AS count FROM orders WHERE status = 'paid'").get().count;
    const ordersDone = db.prepare("SELECT COUNT(*) AS count FROM orders WHERE status = 'done'").get().count;
    const ordersCancelled = db.prepare("SELECT COUNT(*) AS count FROM orders WHERE status = 'cancelled'").get().count;

    const totalStories = db.prepare('SELECT COUNT(*) AS count FROM generated_stories').get().count;
    const storiesPaid = db.prepare('SELECT COUNT(*) AS count FROM generated_stories WHERE paid = 1').get().count;
    const storiesUnpaid = db.prepare('SELECT COUNT(*) AS count FROM generated_stories WHERE paid = 0').get().count;

    const totalContacts = db.prepare('SELECT COUNT(*) AS count FROM contacts').get().count;

    res.json({
      books: totalBooks,
      cartoons: totalCartoons,
      orders: {
        total: totalOrders,
        new: ordersNew,
        paid: ordersPaid,
        done: ordersDone,
        cancelled: ordersCancelled,
      },
      stories: {
        total: totalStories,
        paid: storiesPaid,
        unpaid: storiesUnpaid,
      },
      contacts: totalContacts,
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Books CRUD
// ---------------------------------------------------------------------------

// GET /api/admin/books — list all books (active and inactive)
router.get('/books', (req, res, next) => {
  try {
    const db = getDatabase();
    const books = db.prepare('SELECT * FROM books ORDER BY sort_order ASC, id ASC').all();
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/books — create a new book
router.post('/books', (req, res, next) => {
  try {
    const {
      title, slug, description, therapy_effect,
      age_min, age_max, themes,
      pages_24_price, pages_36_price,
      badge, image_url, sort_order, active,
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Missing required fields: title, slug' });
    }

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO books (title, slug, description, therapy_effect, age_min, age_max, themes, pages_24_price, pages_36_price, badge, image_url, sort_order, active)
      VALUES (@title, @slug, @description, @therapy_effect, @age_min, @age_max, @themes, @pages_24_price, @pages_36_price, @badge, @image_url, @sort_order, @active)
    `);

    const result = stmt.run({
      title,
      slug,
      description: description || null,
      therapy_effect: therapy_effect || null,
      age_min: age_min ?? 3,
      age_max: age_max ?? 10,
      themes: themes || null,
      pages_24_price: pages_24_price ?? 4900,
      pages_36_price: pages_36_price ?? 6900,
      badge: badge || null,
      image_url: image_url || null,
      sort_order: sort_order ?? 0,
      active: active ?? 1,
    });

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/books/:id — update a book
router.put('/books/:id', (req, res, next) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const {
      title, slug, description, therapy_effect,
      age_min, age_max, themes,
      pages_24_price, pages_36_price,
      badge, image_url, sort_order, active,
    } = req.body;

    const stmt = db.prepare(`
      UPDATE books SET
        title = @title,
        slug = @slug,
        description = @description,
        therapy_effect = @therapy_effect,
        age_min = @age_min,
        age_max = @age_max,
        themes = @themes,
        pages_24_price = @pages_24_price,
        pages_36_price = @pages_36_price,
        badge = @badge,
        image_url = @image_url,
        sort_order = @sort_order,
        active = @active
      WHERE id = @id
    `);

    stmt.run({
      id: req.params.id,
      title: title ?? existing.title,
      slug: slug ?? existing.slug,
      description: description ?? existing.description,
      therapy_effect: therapy_effect ?? existing.therapy_effect,
      age_min: age_min ?? existing.age_min,
      age_max: age_max ?? existing.age_max,
      themes: themes ?? existing.themes,
      pages_24_price: pages_24_price ?? existing.pages_24_price,
      pages_36_price: pages_36_price ?? existing.pages_36_price,
      badge: badge ?? existing.badge,
      image_url: image_url ?? existing.image_url,
      sort_order: sort_order ?? existing.sort_order,
      active: active ?? existing.active,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/books/:id — soft delete (set active=0)
router.delete('/books/:id', (req, res, next) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Book not found' });
    }

    db.prepare('UPDATE books SET active = 0 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Cartoons CRUD
// ---------------------------------------------------------------------------

// GET /api/admin/cartoons — list all cartoons
router.get('/cartoons', (req, res, next) => {
  try {
    const db = getDatabase();
    const cartoons = db.prepare('SELECT * FROM cartoons ORDER BY sort_order ASC, id ASC').all();
    res.json(cartoons);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/cartoons — create a cartoon
router.post('/cartoons', (req, res, next) => {
  try {
    const {
      title, slug, description, therapy_effect,
      duration_min, price, age_min, age_max,
      themes, video_url, badge, sort_order, active,
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Missing required fields: title, slug' });
    }

    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO cartoons (title, slug, description, therapy_effect, duration_min, price, age_min, age_max, themes, video_url, badge, sort_order, active)
      VALUES (@title, @slug, @description, @therapy_effect, @duration_min, @price, @age_min, @age_max, @themes, @video_url, @badge, @sort_order, @active)
    `);

    const result = stmt.run({
      title,
      slug,
      description: description || null,
      therapy_effect: therapy_effect || null,
      duration_min: duration_min ?? 4,
      price: price ?? 3900,
      age_min: age_min ?? 3,
      age_max: age_max ?? 10,
      themes: themes || null,
      video_url: video_url || null,
      badge: badge || null,
      sort_order: sort_order ?? 0,
      active: active ?? 1,
    });

    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/cartoons/:id — update a cartoon
router.put('/cartoons/:id', (req, res, next) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM cartoons WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Cartoon not found' });
    }

    const {
      title, slug, description, therapy_effect,
      duration_min, price, age_min, age_max,
      themes, video_url, badge, sort_order, active,
    } = req.body;

    const stmt = db.prepare(`
      UPDATE cartoons SET
        title = @title,
        slug = @slug,
        description = @description,
        therapy_effect = @therapy_effect,
        duration_min = @duration_min,
        price = @price,
        age_min = @age_min,
        age_max = @age_max,
        themes = @themes,
        video_url = @video_url,
        badge = @badge,
        sort_order = @sort_order,
        active = @active
      WHERE id = @id
    `);

    stmt.run({
      id: req.params.id,
      title: title ?? existing.title,
      slug: slug ?? existing.slug,
      description: description ?? existing.description,
      therapy_effect: therapy_effect ?? existing.therapy_effect,
      duration_min: duration_min ?? existing.duration_min,
      price: price ?? existing.price,
      age_min: age_min ?? existing.age_min,
      age_max: age_max ?? existing.age_max,
      themes: themes ?? existing.themes,
      video_url: video_url ?? existing.video_url,
      badge: badge ?? existing.badge,
      sort_order: sort_order ?? existing.sort_order,
      active: active ?? existing.active,
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/cartoons/:id — soft delete (set active=0)
router.delete('/cartoons/:id', (req, res, next) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM cartoons WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Cartoon not found' });
    }

    db.prepare('UPDATE cartoons SET active = 0 WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Orders management
// ---------------------------------------------------------------------------

// GET /api/admin/orders — list all orders (newest first), optional ?status=
router.get('/orders', (req, res, next) => {
  try {
    const db = getDatabase();
    const { status } = req.query;

    let orders;
    if (status) {
      orders = db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC').all(status);
    } else {
      orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    }

    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/orders/:id — update order status
router.put('/orders/:id', (req, res, next) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Missing required field: status' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Generated stories
// ---------------------------------------------------------------------------

// GET /api/admin/stories — list all generated stories (newest first)
router.get('/stories', (req, res, next) => {
  try {
    const db = getDatabase();
    const stories = db.prepare('SELECT * FROM generated_stories ORDER BY created_at DESC').all();
    res.json(stories);
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

// GET /api/admin/contacts — list all contacts (newest first)
router.get('/contacts', (req, res, next) => {
  try {
    const db = getDatabase();
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
