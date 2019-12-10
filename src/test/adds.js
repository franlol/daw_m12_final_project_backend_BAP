const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const app = require('../app');
const data = require('./config');

const { getToken, getUser } = require('./utils.js');
const { createUserTest } = require('./moked');

let ad = null;

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

  ad = res.body;
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

const getAdByUserId = async () => {
  const token = await getToken(data.user.email, data.user.password);
  const loggedUser = await getUser(token);

  const res = await request(app)
    .get(`/adds/${loggedUser._id}`)
    .set({ ['access-token']: `Bearer ${token}` });

  expect(res.status).toEqual(200);
  expect(res.body.ad).toHaveProperty('title', 'Test Add');
  expect(res.body.ad).toHaveProperty('description', 'This is a test add');
  expect(res.body.ad).toHaveProperty('range', 5);
  expect(res.body.ad).toHaveProperty('price', 25);
};

const getAdsWithinDistanceAndCP = async () => {
  const token = await getToken(data.user.email, data.user.password);
  const loggedUser = await getUser(token);

  const res = await request(app)
    .get('/adds/cp/08720?distance=6')
    .set({ ['access-token']: `Bearer ${token}` });

    const ourAd = res.body.ads.filter(ad => {
      return loggedUser._id === ad.owner._id;
    });

    expect(res.status).toEqual(200);
    expect(ourAd.length).toBeGreaterThanOrEqual(1);
    expect(ourAd[0]).toHaveProperty('title', 'Test Add');
    expect(ourAd[0]).toHaveProperty('description', 'This is a test add');
    expect(ourAd[0]).toHaveProperty('range', 5);
    expect(ourAd[0]).toHaveProperty('price', 25);
}

const dontGetAdWithLowRange = async () => {
    const token = await getToken(data.user.email, data.user.password);
    const loggedUser = await getUser(token);
  
    const res = await request(app)
      .get('/adds/cp/08720?distance=2')
      .set({ ['access-token']: `Bearer ${token}` });
  
      const ourAd = res.body.ads.filter(ad => {
        return loggedUser._id === ad.owner;
      });

      expect(res.status).toEqual(200);
      expect(ourAd.length).toBe(0);
  }

const deleteAd = async () => {
  const token = await getToken(data.user.email, data.user.password);

  const res = await request(app)
    .delete(`/adds/${ad._id}`)
    .set({ ['access-token']: `Bearer ${token}` });

  expect(res.status).toEqual(200);
}

const updateAd = async () => {
  const token = await getToken(data.user.email, data.user.password);

  const res = await request(app)
    .put(`/adds/${ad._id}`)
    .set({ ['access-token']: `Bearer ${token}` })
    .send({
      title: 'Test Add updated',
      description: 'This is a test add updated',
      range: 10,
      services: {
        babysitter: false,
        classes: false,
        cleaner: true,
        pets: true
      },
      price: 50
    });

    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('Ad updated');
}

const updateAdWithInvalidToken = async () => {
  const token = await getToken(data.user.email, data.user.password);

  const res = await request(app)
    .put(`/adds/${ad._id}`)
    .set({ ['access-token']: `Bearer 12345` })
    .send({
      title: 'Test Add updated',
      description: 'This is a test add updated',
      range: 10,
      services: {
        babysitter: false,
        classes: false,
        cleaner: true,
        pets: true
      },
      price: 50
    });

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Token invalid');
}

const updateAdWithExpiredToken = async () => {
  const token = process.env.TEST_EXPIRED_TOKEN;

  const res = await request(app)
    .put(`/adds/${ad._id}`)
    .set({ ['access-token']: `Bearer ${token}` })
    .send({
      title: 'Test Add updated',
      description: 'This is a test add updated',
      range: 10,
      services: {
        babysitter: false,
        classes: false,
        cleaner: true,
        pets: true
      },
      price: 50
    });

    expect(res.status).toEqual(401);
    expect(res.body.message).toEqual('Token expired');
}

module.exports = {
  createAdd,
  createAddWithInvalidToken,

  getAdByUserId,

  getAdsWithinDistanceAndCP,
  dontGetAdWithLowRange,

  deleteAd,

  updateAd,
  updateAdWithInvalidToken,
  updateAdWithExpiredToken,
};
