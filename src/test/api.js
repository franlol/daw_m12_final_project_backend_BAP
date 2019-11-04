const request = require('supertest');
const app = require('../app');

const apiIsRunning = async () => {
  const res = await request(app).get('/');
  expect(res.status).toEqual(404);
}

module.exports = {
  apiIsRunning
}