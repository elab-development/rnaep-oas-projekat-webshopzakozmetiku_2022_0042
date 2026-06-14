const pool = require("./db");

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      is_active BOOLEAN DEFAULT false
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS promo_codes (
      id SERIAL PRIMARY KEY,
      campaign_id INTEGER REFERENCES campaigns(id),
      code VARCHAR(50) UNIQUE NOT NULL,
      discount_value DECIMAL(10,2) NOT NULL,
      max_uses INTEGER,
      current_uses INTEGER DEFAULT 0
    )
  `);
};

const getCampaigns = async () => {
  const result = await pool.query("SELECT * FROM campaigns ORDER BY id DESC");
  return result.rows;
};

const getCampaignById = async (id) => {
  const result = await pool.query("SELECT * FROM campaigns WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

const createCampaign = async (name, description, start_date, end_date) => {
  const result = await pool.query(
    "INSERT INTO campaigns (name, description, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, description, start_date, end_date],
  );
  return result.rows[0];
};

const getPromoCodeByCode = async (code) => {
  const result = await pool.query("SELECT * FROM promo_codes WHERE code = $1", [
    code,
  ]);
  return result.rows[0];
};

const createPromoCode = async (campaign_id, code, discount_value, max_uses) => {
  const result = await pool.query(
    "INSERT INTO promo_codes (campaign_id, code, discount_value, max_uses) VALUES ($1, $2, $3, $4) RETURNING *",
    [campaign_id, code, discount_value, max_uses],
  );
  return result.rows[0];
};

const incrementPromoCodeUses = async (code) => {
  await pool.query(
    "UPDATE promo_codes SET current_uses = current_uses + 1 WHERE code = $1",
    [code],
  );
};

module.exports = {
  createTables,
  getCampaigns,
  getCampaignById,
  createCampaign,
  getPromoCodeByCode,
  createPromoCode,
  incrementPromoCodeUses,
};
