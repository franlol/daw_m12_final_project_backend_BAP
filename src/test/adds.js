const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const app = require('../app');
const data = require('./config');

const { getToken, getUser } = require('./utils.js');
const { createUserTest } = require('./moked');

const createAdd = async () => {
  await createUserTest();
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

const getAdByUser = async () => {
  const token = await getToken(data.user.email, data.user.password);
  const res = await request(app)
    .get('/adds')
    .set({ ['access-token']: `Bearer ${token}` });

  expect(res.status).toEqual(200);
  expect(res.body.ad).toHaveProperty('title', 'Test Add');
  expect(res.body.ad).toHaveProperty('description', 'This is a test add');
  expect(res.body.ad).toHaveProperty('range', 5);
  expect(res.body.ad).toHaveProperty('price', 25);

};

const deleteAd = async (done) => {
  const token = await getToken(data.user.email, data.user.password);
  const loggedUser = await getUser(token);

  // Get add by user (no endpoint ATM)
  // TODO delete after find

  return done();
}

module.exports = {
  createAdd,
  createAddWithInvalidToken,
  getAdByUser,
  deleteAd
};
