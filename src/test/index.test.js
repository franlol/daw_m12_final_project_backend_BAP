const dotenv = require('dotenv');

const apiTests = require('./api');
const authTests = require('./auth');
const profileTests = require('./profile');
const addsTests = require('./adds');

const dbConnection = require('../database');
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

  describe('# API Tests', () => {
    it('- Should run the API and give a response.', apiTests.apiIsRunning);
  });

  describe('# AUTH Tests', () => {
    describe('- /Login', () => {
      it('- Should not login a unexistent username.', authTests.loginUnexistentUserame);
      it('- Should not login with invalid credentials.', authTests.loginWithIncorrectCredentials);
      it('- Should not login with empty fields.', authTests.loginWithEmptyFields);
      it('- Should login a moked user.', authTests.loginMokedUser);
    });

    describe('- /Signup', () => {
      it('- Should not signup a new user with invalid password.', authTests.signupWithInvalidPassword);
      it('- Should not sign up a existing user.', authTests.signupExistingUser);
      it('- Should not sign up with empty fields.', authTests.signupWithEmptyFields);
      it('- Should signup a new user', authTests.signUpNewUser);
    });

    describe('- /Logout', () => {
      it('- Should logout a user with valid token', authTests.logoutUserWithValidToken);
      it('- Should not logout a user with invalid token', authTests.logoutUserWithInvalidToken);
    });
  });

  describe('# PROFILE Testing', () => {
    describe('- /Profile @ GET', () => {
      it('- Should return a full user object when access with valid token.', profileTests.getOwnProfileWithValidToken);
      it('- Should not return a user data when access without token.', profileTests.getOwnProfileWithoutToken);
      it('- Should not return a user data when access with expired token.', profileTests.getOwnProfileWithExpiredToken);
      it('- Should not return a user data when access with invalid token.', profileTests.getOwnProfileWithInvalidToken);
    });

    describe('- /Profile @ PUT', () => {
      it('- Should update testing user.', profileTests.updateTestingUser);
      it('- Should not update testing user with invalid zipcode.', profileTests.updateTestingUserWithInvalidZipcode);
    });

    describe('- /Profile/:id @ GET', () => {
      it('- Should return user information when accessing /profile/:id with valid token.', profileTests.getProfileByIdWithValidToken);
      it('- Should not return user information when accessing /profile/:id with invalid token.', profileTests.getProfileByIdWithInvalidToken);
      it('- Should not return user information when accessing /profile/:id with invalid ID.', profileTests.getProfileWithInvalidId);
    });
  });

  describe('# ADDS Testing ', () => {
    describe('- /Adds @ POST', () => {
      it('- Should create a new add', addsTests.createAdd);
      it('- Should return error when token is invalid', addsTests.createAddWithInvalidToken);
      it('- Should delete previous ad', addsTests.deleteAd);
    });
  });

});
