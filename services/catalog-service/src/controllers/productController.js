const Product = require('../models/productModel');

const getAllProducts = async (req, res) => {
  try {
    const { category, brand, skin_type } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (skin_type) filter.skin_type = skin_type;

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Proizvod nije pronadjen' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Proizvod nije pronadjen' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Proizvod nije pronadjen' });
    }
    res.json({ message: 'Proizvod obrisan' });
  } catch (error) {
    res.status(500).json({ message: 'Greska na serveru', error: error.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };