const CircuitBreaker = require('opossum');
const axios = require('axios');

const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
};

const checkProductStock = async (productId) => {
  const catalogUrl = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';
  const response = await axios.get(`${catalogUrl}/products/${productId}`);
  return response.data;
};

const breaker = new CircuitBreaker(checkProductStock, options);

breaker.fallback(() => {
  console.log('Circuit breaker fallback - stock check unavailable, allowing order');
  return null;
});

breaker.on('open', () => console.log('Stock Circuit breaker OPEN - catalog-service nedostupan'));
breaker.on('close', () => console.log('Stock Circuit breaker CLOSED - catalog-service oporavljen'));

module.exports = breaker;