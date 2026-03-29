CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  therapy_effect TEXT,
  age_min INTEGER DEFAULT 3,
  age_max INTEGER DEFAULT 10,
  themes TEXT,
  pages_24_price INTEGER DEFAULT 4900,
  pages_36_price INTEGER DEFAULT 6900,
  badge TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cartoons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  therapy_effect TEXT,
  duration_min INTEGER DEFAULT 4,
  price INTEGER DEFAULT 3900,
  age_min INTEGER DEFAULT 3,
  age_max INTEGER DEFAULT 10,
  themes TEXT,
  video_url TEXT,
  badge TEXT,
  sort_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  product_id INTEGER,
  product_title TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  child_name TEXT,
  child_gender TEXT,
  format TEXT,
  status TEXT DEFAULT 'new',
  total INTEGER,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS generated_stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_name TEXT,
  child_gender TEXT,
  child_age INTEGER,
  problem TEXT,
  favorite_character TEXT,
  friend_name TEXT,
  wishes TEXT,
  story_title TEXT,
  story_preview TEXT,
  story_full TEXT,
  pdf_path TEXT,
  paid INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
