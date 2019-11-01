const request = require('supertest');
const dotenv = require('dotenv');

const app = require('../app');
const dbConnection = require('../database')
const data = require('./config');

dotenv.config();

describe('/LOGIN testing', () => {
  let db;

  beforeAll(async () => {
    db = await dbConnection();
  });

  afterAll(async () => {
    await dbConnection.close();
    dbConnection.disconnect();
    await db.close();
  });

  test('Should not login a unexistent username', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: `${data.user.email}qwerty`,
        password: data.user.password
      });

    expect(res.status).toEqual(422);
    expect(res.body.auth).toBe(false);
  });

  test('Should not login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: data.user.email,
        password: `${data.user.password}${data.user.password}`
      });

    expect(res.status).toEqual(422);
    expect(res.body.auth).toBe(false);
  });

  test('Should not login with empty fields', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: undefined,
        password: undefined
      });

    expect(res.status).toEqual(422);
    expect(res.body.auth).toBe(false);
  });

  test('Should login a moked user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: data.user.email,
        password: data.user.password
      });

    expect(res.status).toEqual(200);
    expect(res.body.auth).toBe(true);
    expect(res.body).toHaveProperty('token');
  });
});
