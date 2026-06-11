const express = require('express');
const cors = require('cors');
require('dotenv').config();
const productRoutes = require('./src/routes/productRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/reviews', reviewRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Catalog Service is running' });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Catalog Service running on port ${PORT}`);
});