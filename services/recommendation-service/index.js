const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/models/db');
const recommendationRoutes = require('./src/routes/recommendationRoutes');
const { connectKafka, startConsuming } = require('./src/kafka/consumer');
const recommendationController = require('./src/controllers/recommendationController');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/recommendations', recommendationRoutes);

const PORT = process.env.PORT || 3004;

const start = async () => {
  try {
    await connectKafka();
    await startConsuming(recommendationController);
  } catch (err) {
    console.error('Kafka connection failed:', err.message);
  }
  app.listen(PORT, () => console.log(`Recommendation service running on port ${PORT}`));
};

start();