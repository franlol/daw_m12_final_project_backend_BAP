const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config();

const app = require('../app');
const data = require('./config');
const { getToken, getUser } = require('./utils.js');

const getOwnProfileWithValidToken = async () => {
  const token = await getToken(data.user.email, data.user.password);

  const loggedUser = await getUser(token);
  expect(loggedUser).toHaveProperty('_id');
  expect(loggedUser).toHaveProperty('location');
  expect(loggedUser).toHaveProperty('username');
  expect(loggedUser).toHaveProperty('name');
  expect(loggedUser).toHaveProperty('surname');
  expect(loggedUser).toHaveProperty('email');
  expect(loggedUser).toHaveProperty('cp');
  expect(loggedUser).toHaveProperty('createdAt');
  expect(loggedUser).toHaveProperty('updatedAt');
  expect(loggedUser).not.toHaveProperty('password');
}

const getOwnProfileWithoutToken = async () => {
  const res = await request(app).get('/profile');

  expect(res.status).toEqual(403);
}

const getOwnProfileWithExpiredToken = async () => {
  const res = await request(app)
    .get('/profile')
    .set({ ['access-token']: `Baerer ${process.env.TEST_EXPIRED_TOKEN}` });

  expect(res.status).toEqual(401);
}

const getOwnProfileWithInvalidToken = async () => {
  const token = await getToken(data.user.email, data.user.password);

  const res = await request(app)
    .get('/profile')
    .set({ ['access-token']: `Baerer ${token}a` });

  expect(res.status).toEqual(401);
}

const updateTestingUser = async () => {
  const token = await getToken(data.user.email, data.user.password);

  const res = await request(app)
    .post('/profile')
    .set({ ['access-token']: `Baerer ${token}` })
    .send({
      'username': 'userUpdated',
      'name': 'updated User for Jest testsa1asd',
      'surname': 'updated test',
      'email': `a${process.env.TEST_EMAIL}`,
      'cp': '08730',
    });

  expect(res.body).toHaveProperty('message', 'User updated');
  expect(res.body).toHaveProperty('token');
  expect(res.body).toHaveProperty('updatedUser');

  expect(res.body.updatedUser).toHaveProperty('username', 'userUpdated');
  expect(res.body.updatedUser).toHaveProperty('name', 'updated User for Jest testsa1asd');
  expect(res.body.updatedUser).toHaveProperty('surname', 'updated test');
  expect(res.body.updatedUser).toHaveProperty('email', `a${process.env.TEST_EMAIL}`);
  expect(res.body.updatedUser).toHaveProperty('cp', '08730');
  expect(res.body.updatedUser).toHaveProperty('location');

  expect(res.body.updatedUser.location).toHaveProperty('accuracy');
  expect(res.body.updatedUser.location).toHaveProperty('community');
  expect(res.body.updatedUser.location).toHaveProperty('community_code');
  expect(res.body.updatedUser.location).toHaveProperty('country_code');
  expect(res.body.updatedUser.location).toHaveProperty('latitude');
  expect(res.body.updatedUser.location).toHaveProperty('longitude');
  expect(res.body.updatedUser.location).toHaveProperty('place');
  expect(res.body.updatedUser.location).toHaveProperty('province');
  expect(res.body.updatedUser.location).toHaveProperty('province_code');
  expect(res.body.updatedUser.location).toHaveProperty('state');
  expect(res.body.updatedUser.location).toHaveProperty('state_code');
  expect(res.body.updatedUser.location).toHaveProperty('zip_code');

  expect(res.status).toEqual(200);
}

const updateTestingUserWithInvalidZipcode = async () => {
  const token = await getToken(`a${data.user.email}`, data.user.password);

  const res = await request(app)
    .post('/profile')
    .set({ ['access-token']: `Baerer ${token}` })
    .send({
      'username': 'userUpdated',
      'name': 'updated User for Jest testsa1asd',
      'surname': 'updated test',
      'email': `a${process.env.TEST_EMAIL}`,
      'cp': '99999',
    });

  expect(res.body).toHaveProperty('message', 'Invalid spanish zipcode');
  expect(res.body).toHaveProperty('auth', false);
  expect(res.status).toEqual(422);
}

const getProfileByIdWithValidToken = async () => {
  const token = await getToken(`a${data.user.email}`, data.user.password);
  const loggedUser = await getUser(token);

  const res = await request(app)
    .get(`/profile/${loggedUser._id}`)
    .set({ ['access-token']: `Baerer ${token}` });

  expect(res.body).toHaveProperty('user');
  expect(res.body.user).toHaveProperty('username', 'userUpdated');
  expect(res.body.user).toHaveProperty('name', 'updated User for Jest testsa1asd');
  expect(res.body.user).toHaveProperty('surname', 'updated test');
  expect(res.body.user).toHaveProperty('email', `a${process.env.TEST_EMAIL}`);
  expect(res.body.user).toHaveProperty('cp', '99999');
  expect(res.status).toEqual(200);
}

const getProfileByIdWithInvalidToken = async () => {
  const token = await getToken(`a${data.user.email}`, data.user.password);
  const loggedUser = await getUser(token);

  const res = await request(app)
    .get(`/profile/${loggedUser._id}`)
    .set({ ['access-token']: `Baerer ${token}a` })

  expect(res.status).toEqual(401);
}

const getProfileWithInvalidId = async () => {
  const token = await getToken(`a${data.user.email}`, data.user.password);
  const loggedUser = await getUser(token);

  const res = await request(app)
    .get(`/profile/${loggedUser._id}a`)
    .set({ ['access-token']: `Baerer ${token}` })

  expect(res.status).toEqual(422);
}

module.exports = {
  getOwnProfileWithValidToken,
  getOwnProfileWithoutToken,
  getOwnProfileWithExpiredToken,
  getOwnProfileWithInvalidToken,

  updateTestingUser,
  updateTestingUserWithInvalidZipcode,

  getProfileByIdWithValidToken,
  getProfileByIdWithInvalidToken,
  getProfileWithInvalidId
}
