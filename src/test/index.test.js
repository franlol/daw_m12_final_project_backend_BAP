const request = require('supertest');
const dotenv = require('dotenv');

const apiTests = require('./api');
const authTests = require('./auth');
const profileTests = require('./profile');

const dbConnection = require('../database')
const { deleteUserUpdatedTest } = require('./moked');
dotenv.config();

describe('BAP TESTS', () => {
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

  // API test
  test('API Runs and give a response.', apiTests.apiIsRunning);

  // Auth
  // Login Testing
  test('Should not login a unexistent username.', authTests.loginUnexistentUserame);
  test('Should not login with invalid credentials.', authTests.loginWithIncorrectCredentials);
  test('Should not login with empty fields.', authTests.loginWithEmptyFields);
  test('Should login a moked user.', authTests.loginMokedUser);
  // Signup Testing
  test('Should not signup a new user with invalid password.', authTests.signupWithInvalidPassword);
  test('Should not signup a new user with invalid username.', authTests.signupWithInvalidUsername);
  test('Should not signup a new user with inalid zipcode', authTests.signupWithInvalidZipcode);
  test('Should not sign up a existing user.', authTests.signupExistingUser);
  test('Should not sign up with empty fields.', authTests.signupWithEmptyFields);
  test('Should signup a new user', authTests.signUpNewUser);

  // Profile Testing
  // Get /profile
  test('Should return a full user object when access /profile@get with valid token.', profileTests.getOwnProfileWithValidToken);
  test('Should not return a user data when access /profile@get without token.', profileTests.getOwnProfileWithoutToken);
  test('Should not return a user data when access /profile@get with expired token.', profileTests.getOwnProfileWithExpiredToken);
  test('Should not return a user data when access /profile@get with invalid token.', profileTests.getOwnProfileWithInvalidToken);
  // Post /profile
  test('Should update testing user.', profileTests.updateTestingUser);
  test('Should not update testing user with invalid zipcode.', profileTests.updateTestingUserWithInvalidZipcode);
  // Get /profile/:id
  test('Should return user information when accessing /profile/:id with valid token.', profileTests.getProfileByIdWithValidToken);
  test('Should not return user information when accessing /profile/:id with invalid token.', profileTests.getProfileByIdWithInvalidToken);
  test('Should not return user information when accessing /profile/:id with invalid ID.', profileTests.getProfileWithInvalidId);
});
