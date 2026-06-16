const { sendMessage } = require("../kafka/producer");

const pool = require("../models/db");
const axios = require("axios");

const getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, email, role, created_at FROM users WHERE id = $1",
      [req.user.id],
    );
    res.json(user.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greska na serveru", error: error.message });
  }
};

const getBeautyProfile = async (req, res) => {
  try {
    const profile = await pool.query(
      "SELECT * FROM beauty_profiles WHERE user_id = $1",
      [req.user.id],
    );
    if (profile.rows.length === 0) {
      return res.status(404).json({ message: "Beauty profil ne postoji" });
    }
    res.json(profile.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greska na serveru", error: error.message });
  }
};

const createOrUpdateBeautyProfile = async (req, res) => {
  try {
    const { skin_type, allergies, preferences, favorite_brands } = req.body;

    const existing = await pool.query(
      "SELECT * FROM beauty_profiles WHERE user_id = $1",
      [req.user.id],
    );

    let profile;
    if (existing.rows.length > 0) {
      const updated = await pool.query(
        `UPDATE beauty_profiles 
         SET skin_type=$1, allergies=$2, preferences=$3, favorite_brands=$4 
         WHERE user_id=$5 RETURNING *`,
        [skin_type, allergies, preferences, favorite_brands, req.user.id],
      );
      profile = updated.rows[0];
    } else {
      const newProfile = await pool.query(
        `INSERT INTO beauty_profiles (user_id, skin_type, allergies, preferences, favorite_brands) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [req.user.id, skin_type, allergies, preferences, favorite_brands],
      );
      profile = newProfile.rows[0];
    }

    try {
      await sendMessage("beauty-profile-updated", {
        userId: req.user.id,
        skinType: skin_type,
        favoriteBrands: favorite_brands
          ? favorite_brands.split(",").map((b) => b.trim())
          : [],
        allergies: allergies ? allergies.split(",").map((a) => a.trim()) : [],
      });
      console.log("Beauty profile Kafka message sent");
    } catch (err) {
      console.log("Kafka error:", err.message);
    }

    res.status(201).json(profile);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Greska na serveru", error: error.message });
  }
};

module.exports = { getProfile, getBeautyProfile, createOrUpdateBeautyProfile };
