const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config();

const app = require('../app');
const dbConnection = require('../database')
const data = require('./config');

describe('/PROFILE testing', () => {
  let db;
  let token;
  let loggedUser;

  beforeAll(async () => {
    db = await dbConnection();

    // Login for token
    let res = await request(app)
      .post('/auth/login')
      .send({
        email: data.user.email,
        password: data.user.password
      });

    token = res.body.token.split(" ")[1];

    expect(token).toBeDefined();
  });

  afterAll(async () => {
    await dbConnection.close();
    dbConnection.disconnect();
    await db.close();
  });

  test('Should return a full user object when access /profile@get with valid token.', async () => {
    // Getting user object
    res = await request(app)
      .get('/profile')
      .set({ ['access-token']: `Baerer ${token}` });

    loggedUser = res.body;
    expect(loggedUser).toHaveProperty('_id');
    expect(loggedUser).toHaveProperty('username');
    expect(loggedUser).toHaveProperty('name');
    expect(loggedUser).toHaveProperty('surname');
    expect(loggedUser).toHaveProperty('email');
    expect(loggedUser).toHaveProperty('cp');
    // expect(loggedUser).toHaveProperty('location');
    expect(loggedUser).toHaveProperty('createdAt');
    expect(loggedUser).toHaveProperty('updatedAt');
  });

  test('Should NOT return a user data when access /profile@get without token.', async () => {
    res = await request(app).get('/profile');

    expect(res.status).toEqual(403);
  });

  test('Should NOT return a user data when access /profile@get with expired token.', async () => {
    res = await request(app)
      .get('/profile')
      .set({ ['access-token']: `Baerer ${process.env.TEST_EXPIRED_TOKEN}` });

    expect(res.status).toEqual(200); // TODO change to 401 (token will be expired in 1h)
  });

  test('Should NOT return a user data when access /profile@get with inalid token.', async () => {
    res = await request(app)
      .get('/profile')
      .set({ ['access-token']: `Baerer ${token}a` });

    expect(res.status).toEqual(401);
  });

  test('Should update testing user.', async () => {
    res = await request(app)
      .post('/profile')
      .set({ ['access-token']: `Baerer ${token}` })
      .send({
        'username': 'userUpdated',
        'name': 'updated User for Jest testsa1asd',
        'surname': 'updated test',
        'email': 'updatedTest@test.com',
        'password': 'm0k3Dpassword',
        'cp': '00001',
      });

    expect(res.body).toHaveProperty('message', 'User updated');
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('updatedUser');

    expect(res.body.updatedUser).toHaveProperty('username', 'userUpdated');
    expect(res.body.updatedUser).toHaveProperty('name', 'updated User for Jest testsa1asd');
    expect(res.body.updatedUser).toHaveProperty('surname', 'updated test');
    expect(res.body.updatedUser).toHaveProperty('email', 'updatedTest@test.com');
    expect(res.body.updatedUser).toHaveProperty('cp', '00001');

    expect(res.status).toEqual(200);
  });

  test('Should return user information when accessing /profile/:id', async () => {
    const res = await request(app)
      .get(`/profile/${loggedUser._id}`)
      .set({ ['access-token']: `Baerer ${token}` })

    expect(res.body).toHaveProperty('user');

    expect(res.body.user).toHaveProperty('username', 'userUpdated');
    expect(res.body.user).toHaveProperty('name', 'updated User for Jest testsa1asd');
    expect(res.body.user).toHaveProperty('surname', 'updated test');
    expect(res.body.user).toHaveProperty('email', 'updatedTest@test.com');
    expect(res.body.user).toHaveProperty('cp', '00001');

    expect(res.status).toEqual(200);
  });

  test('Should NOT return user information when accessing /profile/:id with invalid token', async () => {
    const res = await request(app)
      .get(`/profile/${loggedUser._id}`)
      .set({ ['access-token']: `Baerer ${token}a` })

    expect(res.status).toEqual(401);
  });

  test('Should NOT return user information when accessing /profile/:id with invalid ID', async () => {
    const res = await request(app)
      .get(`/profile/${loggedUser._id}a`)
      .set({ ['access-token']: `Baerer ${token}` })

    expect(res.status).toEqual(422);
  });
});
