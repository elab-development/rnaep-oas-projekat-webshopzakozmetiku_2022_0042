const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const promClient = require('prom-client');
require('dotenv').config();
const { createTables } = require('./src/models/orderModel');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
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

app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Order Service is running' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

const PORT = process.env.PORT || 3003;

const start = async () => {
  await createTables();
  try {
    await connectProducer();
  } catch (err) {
    console.error('Kafka producer connection failed:', err.message);
  }
  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
  });
};

start();