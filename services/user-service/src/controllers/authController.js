const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../models/db");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Korisnik vec postoji" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
      [username || null, email, hashedPassword, role || "CUSTOMER"],
    );

    res
      .status(201)
      .json({ message: "Registracija uspesna", user: newUser.rows[0] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greska na serveru", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Korisnik ne postoji" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Pogresna lozinka" });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greska na serveru", error: error.message });
  }
};

module.exports = { register, login };
