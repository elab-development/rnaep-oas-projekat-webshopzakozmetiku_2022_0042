const pool = require('./db');

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      status VARCHAR(50) DEFAULT 'PENDING',
      total_price DECIMAL(10,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      price DECIMAL(10,2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      product_id VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      price DECIMAL(10,2) DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      payment_method VARCHAR(50) DEFAULT 'CARD',
      status VARCHAR(50) DEFAULT 'PENDING',
      stripe_payment_intent_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

module.exports = { createTables };