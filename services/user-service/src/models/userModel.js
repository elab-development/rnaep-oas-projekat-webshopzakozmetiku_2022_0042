const pool = require('./db');

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'CUSTOMER',
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS beauty_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      skin_type VARCHAR(50),
      allergies TEXT,
      preferences TEXT,
      favorite_brands TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

module.exports = { createTables };