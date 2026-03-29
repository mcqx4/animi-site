require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { initDatabase } = require('./src/db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// JSON body parser (1mb limit for photo uploads)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting on API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Serve admin panel under /admin
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API routes
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/generate', require('./src/routes/generator'));
app.use('/api/contacts', require('./src/routes/contacts'));
app.use('/api/admin', require('./src/routes/admin'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// SPA fallback — serve index.html for all non-API, non-static routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
initDatabase();
app.listen(PORT, () => {
  console.log(`ANIMI Stories server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
