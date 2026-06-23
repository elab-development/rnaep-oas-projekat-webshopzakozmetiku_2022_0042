const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const promClient = require('prom-client');
require('dotenv').config();
const connectDB = require('./src/models/db');
const productRoutes = require('./src/routes/productRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const { connectConsumer, startConsuming } = require('./src/kafka/consumer');
const { connectProducer } = require('./src/kafka/producer');

const app = express();

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Ukupan broj HTTP zahteva',
  labelNames: ['method', 'route', 'status']
});

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

app.use('/products', productRoutes);
app.use('/reviews', reviewRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Catalog Service is running' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
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