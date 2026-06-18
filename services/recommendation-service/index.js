const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const promClient = require('prom-client');
const dotenv = require('dotenv');
const connectDB = require('./src/models/db');
const recommendationRoutes = require('./src/routes/recommendationRoutes');
const { connectKafka, startConsuming } = require('./src/kafka/consumer');
const recommendationController = require('./src/controllers/recommendationController');

dotenv.config();
connectDB();

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

app.use('/api/recommendations', recommendationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Recommendation Service is running' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

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