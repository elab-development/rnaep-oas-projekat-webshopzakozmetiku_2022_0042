const pool = require("../models/db");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createOrder = async (req, res) => {
  try {
    const cartItems = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1",
      [req.user.id]
    );

    if (cartItems.rows.length === 0) {
      return res.status(400).json({ message: "Korpa je prazna" });
    }

    const totalPrice = cartItems.rows.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), 
      currency: "eur",
      metadata: { userId: req.user.id.toString() }
    });

    const newOrder = await pool.query(
      "INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, totalPrice, "PENDING"]
    );

    const orderId = newOrder.rows[0].id;

    for (const item of cartItems.rows) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.product_id, item.quantity, item.price || 0]
      );
    }

    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);

    const msg = {
      to: req.user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Potvrda porudzbine",
      text: `Vasa porudzbina #${orderId} je uspesno kreirana. Ukupna cena: ${totalPrice} EUR.`
    };
    await sgMail.send(msg);

    res.status(201).json({
      order: newOrder.rows[0],
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: "Greska na serveru", error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(orders.rows);
  } catch (error) {
    res.status(500).json({ message: "Greska na serveru", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ message: "Porudzbina nije pronadjena" });
    }

    const items = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [req.params.id]
    );

    res.json({ ...order.rows[0], items: items.rows });
  } catch (error) {
    res.status(500).json({ message: "Greska na serveru", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    res.json(order.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Greska na serveru", error: error.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };