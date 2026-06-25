const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const promClient = require('prom-client');
const dotenv = require('dotenv');
const { createTables } = require('./src/models/campaignModel');
const campaignRoutes = require('./src/routes/campaignRoutes');

dotenv.config();
createTables();

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

app.use('/api/campaigns', campaignRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Campaign Service is running' });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Campaign service running on port ${PORT}`));