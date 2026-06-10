const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String },
  skin_type: { type: String },
  ingredients: { type: [String] },
  stock: { type: Number, default: 0 },
  image_url: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);