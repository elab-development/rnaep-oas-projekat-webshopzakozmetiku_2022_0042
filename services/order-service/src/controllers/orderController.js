const beautyProfileBreaker = require("../utils/circuitBreaker");

const { sendMessage } = require("../kafka/producer");
const pool = require("../models/db");
const axios = require("axios");
const Stripe = require("stripe");
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
const sgMail = require("@sendgrid/mail");
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const createOrder = async (req, res) => {
  try {
    const { guest_email } = req.body || {};
    console.log("Stripe key exists:", !!process.env.STRIPE_SECRET_KEY);
    const isGuest = !req.user;

    let cartItems;

    if (isGuest) {
      const { items } = req.body;
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Korpa je prazna" });
      }
      cartItems = { rows: items };
    } else {
      cartItems = await pool.query(
        "SELECT * FROM cart_items WHERE user_id = $1",
        [req.user.id],
      );
      if (cartItems.rows.length === 0) {
        return res.status(400).json({ message: "Korpa je prazna" });
      }
    }

    const totalPrice = cartItems.rows.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const newOrder = await pool.query(
      "INSERT INTO orders (user_id, total_price, status, guest_email) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        isGuest ? null : req.user.id,
        totalPrice,
        "PENDING",
        guest_email || null,
      ],
    );

    const orderId = newOrder.rows[0].id;
    let clientSecret = null;
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: "eur",
        metadata: { orderId: orderId.toString() },
      });
      console.log("Payment intent created:", paymentIntent.id);
      clientSecret = paymentIntent.client_secret;
    }
    for (const item of cartItems.rows) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [orderId, item.product_id, item.quantity, item.price || 0],
      );
    }

    if (!isGuest) {
      await pool.query("DELETE FROM cart_items WHERE user_id = $1", [
        req.user.id,
      ]);

      try {
        const profileData = await beautyProfileBreaker.fire(
          req.user.id,
          req.headers.authorization,
        );
        const skinType = profileData?.skin_type || null;

        for (const item of cartItems.rows) {
          await sendMessage("order-created", {
            userId: req.user.id,
            productId: item.product_id,
            skinType,
            orderId,
          });
        }
      } catch (err) {
        console.error("Error fetching beauty profile:", err.message);
      }
    }
    if (process.env.SENDGRID_API_KEY && !isGuest) {
      try {
        const userRes = await axios.get(
          `${process.env.USER_SERVICE_URL || "http://user-service:3001"}/users/profile`,
          { headers: { Authorization: req.headers.authorization } },
        );
        const userEmail = userRes.data?.email;
        if (userEmail) {
          await sgMail.send({
            to: userEmail,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject: "Potvrda porudzbine",
            text: `Vasa porudzbina #${orderId} je uspesno kreirana. Ukupna cena: ${totalPrice} RSD.`,
          });
        }
      } catch {}
    }
    res.status(201).json({ order: newOrder.rows[0], clientSecret });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greska na serveru", error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id],
    );
    res.json(orders.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greska na serveru", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id],
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ message: "Porudzbina nije pronadjena" });
    }

    const items = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [req.params.id],
    );

    res.json({ ...order.rows[0], items: items.rows });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greska na serveru", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id],
    );
    res.json(order.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greska na serveru", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC",
    );
    res.json(orders.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greska na serveru", error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};
