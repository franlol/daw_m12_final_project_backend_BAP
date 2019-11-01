const request = require('supertest');
const dotenv = require('dotenv');

const app = require('../app');
dotenv.config();

describe('/LOGIN testing', () => {

  test('Should not login a unexistent username', async () => {
    const res = await request(app).get('/');

    expect(res.status).toEqual(404);
  });
});
