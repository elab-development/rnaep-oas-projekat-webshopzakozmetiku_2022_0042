const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { verifyToken } = require('./src/middleware/authMiddleware');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users/login', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/users/register', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/users', verifyToken, createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/products', verifyToken, createProxyMiddleware({
  target: process.env.CATALOG_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/orders', verifyToken, createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/recommendations', verifyToken, createProxyMiddleware({
  target: process.env.RECOMMENDATION_SERVICE_URL,
  changeOrigin: true
}));

app.use('/api/campaigns', verifyToken, createProxyMiddleware({
  target: process.env.CAMPAIGN_SERVICE_URL,
  changeOrigin: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));