const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { verifyToken } = require("./src/middleware/authMiddleware");

dotenv.config();

const app = express();
app.use(cors());

app.use(
  "/api/users/register",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL + "/auth/register",
    changeOrigin: true,
    pathRewrite: { "^/api/users/register": "" },
  }),
);

app.use(
  "/api/users/login",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL + "/auth/login",
    changeOrigin: true,
    pathRewrite: { "^/api/users/login": "" },
  }),
);

app.use(
  "/api/users",
  verifyToken,
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL + "/users",
    changeOrigin: true,
    pathRewrite: { "^/api/users": "" },
  }),
);

app.use(
  "/api/products",
  createProxyMiddleware({
    target: process.env.CATALOG_SERVICE_URL + "/products",
    changeOrigin: true,
    pathRewrite: { "^/api/products": "" },
  }),
);

app.use(
  "/api/recommendations",
  createProxyMiddleware({
    target: process.env.RECOMMENDATION_SERVICE_URL + "/api/recommendations",
    changeOrigin: true,
    pathRewrite: { "^/api/recommendations": "" },
  }),
);

app.use(
  "/api/campaigns",
  createProxyMiddleware({
    target: process.env.CAMPAIGN_SERVICE_URL + "/api/campaigns",
    changeOrigin: true,
    pathRewrite: { "^/api/campaigns": "" },
  }),
);

app.use(
  "/api/orders/cart",
  verifyToken,
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL + "/cart",
    changeOrigin: true,
    pathRewrite: { "^/api/orders/cart": "" },
  }),
);

app.use(
  "/api/orders",
  verifyToken,
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL + "/orders",
    changeOrigin: true,
    pathRewrite: { "^/api/orders": "" },
  }),
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
