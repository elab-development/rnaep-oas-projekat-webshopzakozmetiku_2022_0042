const request = require('supertest');
const express = require('express');

const app = express();
app.get('/health', (req, res) => {
  res.json({ status: 'User Service is running' });
});

describe('User Service', () => {
  test('Health check vraca 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('User Service is running');
  });
});