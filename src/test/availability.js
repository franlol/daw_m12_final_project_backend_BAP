const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const app = require('../app');
const data = require('./config');

const { getToken, getPost } = require('./utils.js');
const { createPost } = require('./posts');

const calendar = {
  fh1: [true, false, false, true, true, false, false],
  fh2: [true, false, true, false, true, false, false],
  fh3: [false, false, true, false, false, true, false],
  fh4: [false, true, true, false, false, true, false],
  fh5: [false, true, false, false, true, false, false],
  fh6: [true, false, true, true, true, false, false],
  fh7: [true, false, true, false, true, true, false],
  fh8: [false, false, false, false, true, true, false]
};

const createAvailability = async () => {
  await createPost();
  const token = await getToken(data.user.email, data.user.password);
  const post = await getPost(token);
  const res = await request(app)
    .post('/availability')
    .set({ ['access-token']: `Bearer ${token}` })
    .send({
      postId: post._id,
      calendar
    });
  availability = res.body.post;
  expect(res.status).toEqual(201);
};

const getAvailability = async () => {
  const token = await getToken(data.user.email, data.user.password);
  const post = await getPost(token);
  const res = await request(app)
    .get(`/availability/${post._id}`)
    .set({ ['access-token']: `Bearer ${token}` });
  expect(res.status).toEqual(200);
};

const updateAvailability = async () => {
  const token = await getToken(data.user.email, data.user.password);
  const post = await getPost(token);
  const res = await request(app)
    .put(`/availability/${post._id}`)
    .set({ ['access-token']: `Bearer ${token}` })
    .send({
      calendar
    });

  await request(app)
    .delete(`/posts/${post._id}`)
    .set({ ['access-token']: `Bearer ${token}` });

  expect(res.status).toEqual(200);
  expect(res.body.message).toEqual('Availability updated');
};

const updateAvailabilityWithIvaldPostId = async () => {
  const token = await getToken(data.user.email, data.user.password);
  const postId = '521346';
  const res = await request(app)
    .put(`/availability/${postId}`)
    .set({ ['access-token']: `Bearer ${token}` })
    .send({
      calendar
    });

  expect(res.status).toEqual(422);
  expect(res.body.message).toEqual('Invalid Post Id');

};

module.exports = {
  createAvailability,
  getAvailability,
  updateAvailability,
  updateAvailabilityWithIvaldPostId
};
