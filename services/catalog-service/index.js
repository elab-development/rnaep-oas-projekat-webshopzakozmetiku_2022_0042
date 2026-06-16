const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/models/db');
const productRoutes = require('./src/routes/productRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const { connectConsumer, startConsuming } = require('./src/kafka/consumer');
const { connectProducer } = require('./src/kafka/producer');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/reviews', reviewRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Catalog Service is running' });
});

const PORT = process.env.PORT || 3002;

const start = async () => {
  await connectDB();
  try {
    await connectConsumer();
    await startConsuming();
    await connectProducer();
  } catch (err) {
    console.error('Kafka connection failed:', err.message);
  }
  app.listen(PORT, () => {
    console.log(`Catalog Service running on port ${PORT}`);
  });
};

start();