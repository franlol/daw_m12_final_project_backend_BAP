const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config();

const app = require('../app');
const data = require('./config');

// LOGIN
const loginUnexistentUserame = async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: `${data.user.email}qwerty`,
      password: data.user.password
    });

  expect(res.status).toEqual(422);
  expect(res.body.auth).toBe(false);
}

const loginWithIncorrectCredentials = async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: data.user.email,
      password: `${data.user.password}${data.user.password}`
    });

  expect(res.status).toEqual(422);
  expect(res.body.auth).toBe(false);
}

const loginWithEmptyFields = async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: undefined,
      password: undefined
    });

  expect(res.status).toEqual(422);
  expect(res.body.auth).toBe(false);
}

const loginMokedUser = async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: data.user.email,
      password: data.user.password
    });
  expect(res.status).toEqual(200);
  expect(res.body.auth).toBe(true);
  expect(res.body).toHaveProperty('token');
}

// SIGNUP
const signupWithInvalidPassword = async () => {
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
}

const signupWithInvalidUsername = async () => {
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
}

const signupWithInvalidZipcode = async () => {
  const res = await request(app)
    .post('/auth/signup')
    .send({
      username: 'testuser',
      name: 'User for Jest tests',
      surname: 'test',
      email: `a${process.env.TEST_EMAIL}`,
      password: process.env.TEST_PASSWORD,
      cp: '00000',
    });

  expect(res.status).toEqual(422);
  expect(res.body.auth).toBe(false);
}

const signupExistingUser = async () => {
  const res = await request(app)
    .post('/auth/signup')
    .send({
      username: 'testuser',
      name: 'User for Jest tests',
      surname: 'test',
      email: `${process.env.TEST_EMAIL}`,
      password: process.env.TEST_PASSWORD,
      cp: '08730',
    });

  expect(res.status).toEqual(409);
  expect(res.body.auth).toBe(false);
}

signupWithEmptyFields = async () => {
  const res = await request(app)
    .post('/auth/signup')
    .send({
      username: undefined,
      name: undefined,
      surname: undefined,
      email: undefined,
      password: undefined,
      cp: undefined,
    });

  expect(res.status).toEqual(422);
  expect(res.body.auth).toBe(false);
}

const signUpNewUser = async () => {
  const res = await request(app)
    .post('/auth/signup')
    .send({
      username: 'testuser',
      name: 'User for Jest tests',
      surname: 'test',
      email: `a${process.env.TEST_EMAIL}`,
      password: process.env.TEST_PASSWORD,
      cp: '08730',
    });

  expect(res.status).toEqual(200);
  expect(res.body.auth).toBe(true);
  expect(res.body).toHaveProperty('token');
}

module.exports = {
  loginUnexistentUserame,
  loginWithIncorrectCredentials,
  loginWithEmptyFields,
  loginMokedUser,

  signupWithInvalidPassword,
  signupWithInvalidUsername,
  signupWithInvalidZipcode,
  signupExistingUser,
  signupWithEmptyFields,
  signUpNewUser
}
