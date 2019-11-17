const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const app = require('../app');
const data = require('./config');
const { getToken, getUser } = require('./utils.js');

const createAdd = async () => {
  const token = await getToken(data.user.email, data.user.password);
  const loggedUser = await getUser(token);
  const res = await request(app)
    .post('/adds')
    .set({ ['access-token']: `Bearer ${token}` })
    .send({
      owner: loggedUser._id,
      title: 'Test Add',
      description: 'This is a test add',
      range: 5,
      services: {
        babysitter: true,
        classes: true,
        cleaner: false,
        pets: false
      },
      price: 25
    });

  expect(res.status).toEqual(201);
};

const createAddWithInvalidToken = async () => {
  const token = process.env.TEST_EXPIRED_TOKEN;
  const loggedUser = await getUser(token);
  const res = await request(app)
    .post('/adds')
    .set({ ['access-token']: `Bearer 123456` })
    .send({
      owner: loggedUser._id,
      title: 'Test Add',
      description: 'This is a test add',
      range: 5,
      services: {
        babysitter: true,
        classes: true,
        cleaner: false,
        pets: false
      },
      price: 25
    });

  expect(res.status).toEqual(401);
  expect(res.body.message).toEqual('Token invalid');
};

module.exports = {
  createAdd,
  createAddWithInvalidToken
};
