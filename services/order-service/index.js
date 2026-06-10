const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createTables } = require('./src/models/orderModel');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Order Service is running' });
});

const PORT = process.env.PORT || 3003;

const start = async () => {
  await createTables();
  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
  });
};

start();