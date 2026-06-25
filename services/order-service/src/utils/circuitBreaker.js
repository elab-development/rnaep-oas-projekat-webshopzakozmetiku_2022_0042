const CircuitBreaker = require('opossum');
const axios = require('axios');

const options = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
};

const getBeautyProfile = async (userId, authHeader) => {
  const userServiceUrl = process.env.USER_SERVICE_URL || 'http://user-service:3001';
  const response = await axios.get(`${userServiceUrl}/users/beauty-profile`, {
    headers: { Authorization: authHeader }
  });
  return response.data;
};

const breaker = new CircuitBreaker(getBeautyProfile, options);

breaker.fallback(() => {
  console.log('Circuit breaker fallback - beauty profile unavailable');
  return { skin_type: null };
});

breaker.on('open', () => console.log('Circuit breaker OPEN - user-service nedostupan'));
breaker.on('close', () => console.log('Circuit breaker CLOSED - user-service oporavljen'));

module.exports = breaker;