const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config();

const app = require('../app');
const dbConnection = require('../database')
const data = require('./config');
const { deleteUserUpdatedTest } = require('./moked');

describe('/LOGIN testing', () => {
  let db;

  beforeAll(async () => {
    db = await dbConnection();
  });

  afterAll(async () => {
    await deleteUserUpdatedTest();
    await dbConnection.close();
    dbConnection.disconnect();
    await db.close();
  });

  test('Should not login a unexistent username.', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: `${data.user.email}qwerty`,
        password: data.user.password
      });

    expect(res.status).toEqual(422);
    expect(res.body.auth).toBe(false);
  });

  test('Should not login with incorrect credentials.', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: data.user.email,
        password: `${data.user.password}${data.user.password}`
      });

    expect(res.status).toEqual(422);
    expect(res.body.auth).toBe(false);
  });

  test('Should not login with empty fields.', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: undefined,
        password: undefined
      });

    expect(res.status).toEqual(422);
    expect(res.body.auth).toBe(false);
  });

  test('Should login a moked user.', async () => {
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

describe('/SIGNUP testing', () => {
  let db;

  beforeAll(async () => {
    db = await dbConnection();
  });

  afterAll(async () => {
    await deleteUserUpdatedTest();
    await dbConnection.close();
    dbConnection.disconnect();
    await db.close();
  });

  test('Should not sign up a new user with invalid password.', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        name: 'User for Jest tests',
        surname: 'test',
        email: `a${process.env.TEST_EMAIL}`,
        password: 'asd',
        cp: '00000',
        location: [0, 0]
      });

    expect(res.status).toEqual(422);
    expect(res.body.auth).toBe(false);
  });

  test('Should not sign up a new user with invalid username.', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'usern4me!',
        name: 'User for Jest tests',
        surname: 'test',
        email: `a${process.env.TEST_EMAIL}`,
        password: 'asd',
        cp: '00000',
        location: [0, 0]
      });

    expect(res.status).toEqual(422);
    expect(res.body.auth).toBe(false);
  });

  test('Should sign up a new user.', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        name: 'User for Jest tests',
        surname: 'test',
        email: `a${process.env.TEST_EMAIL}`,
        password: process.env.TEST_PASSWORD,
        cp: '00000',
        location: [0, 0]
      });

    expect(res.status).toEqual(200);
    expect(res.body.auth).toBe(true);
    expect(res.body).toHaveProperty('token');
  });

  test('Should not sign up a existing user.', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        name: 'User for Jest tests',
        surname: 'test',
        email: `a${process.env.TEST_EMAIL}`,
        password: process.env.TEST_PASSWORD,
        cp: '00000',
        location: [0, 0]
      });

    expect(res.status).toEqual(409);
    expect(res.body.auth).toBe(false);
  });

  test('Should not sign up with empty fields.', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: undefined,
        name: undefined,
        surname: undefined,
        email: undefined,
        password: undefined,
        cp: undefined,
        location: undefined
      });

    expect(res.status).toEqual(422);
    expect(res.body.auth).toBe(false);
  });
});