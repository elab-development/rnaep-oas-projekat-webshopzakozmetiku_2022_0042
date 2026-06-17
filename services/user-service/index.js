const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { createTables } = require('./src/models/userModel');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const { connectProducer } = require('./src/kafka/producer');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'User Service is running' });
});

const PORT = process.env.PORT || 3001;

const start = async () => {
  await createTables();
  try {
    await connectProducer();
  } catch (err) {
    console.error('Kafka producer connection failed:', err.message);
  }
  app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
  });
};

start();