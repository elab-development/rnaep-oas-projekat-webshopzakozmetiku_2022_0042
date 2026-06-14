const pool = require('../models/db');

const getCart = async (req, res) => {
  try {
    const cart = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1',
      [req.user.id]
    );
    res.json(cart.rows);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity, price } = req.body;

    const existing = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );

    if (existing.rows.length > 0) {
      const updated = await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity, req.user.id, product_id]
      );
      return res.json(updated.rows[0]);
    }

    const newItem = await pool.query(
      'INSERT INTO cart_items (user_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, product_id, quantity, price || 0]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Proizvod uklonjen iz korpe' });
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM cart_items WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ message: 'Korpa isprazjena' });
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };