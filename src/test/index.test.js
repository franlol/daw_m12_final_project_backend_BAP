const dotenv = require('dotenv');

const apiTests = require('./api');
const authTests = require('./auth');
const profileTests = require('./profile');
const postsTests = require('./posts');
const availabilityTests = require('./availability');
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
      it(
        '- Should not login a unexistent username.',
        authTests.loginUnexistentUserame
      );
      it(
        '- Should not login with invalid credentials.',
        authTests.loginWithIncorrectCredentials
      );
      it(
        '- Should not login with empty fields.',
        authTests.loginWithEmptyFields
      );
      it('- Should login a moked user.', authTests.loginMokedUser);
    });

    describe('- /Signup', () => {
      it(
        '- Should not signup a new user with invalid password.',
        authTests.signupWithInvalidPassword
      );
      it('- Should not sign up a existing user.', authTests.signupExistingUser);
      it(
        '- Should not sign up with empty fields.',
        authTests.signupWithEmptyFields
      );
      it('- Should signup a new user', authTests.signUpNewUser);
    });

    describe('- /Logout', () => {
      it(
        '- Should logout a user with valid token',
        authTests.logoutUserWithValidToken
      );
      it(
        '- Should not logout a user with invalid token',
        authTests.logoutUserWithInvalidToken
      );
    });
  });

  describe('# PROFILE Testing', () => {
    describe('- /Profile @ GET', () => {
      it(
        '- Should return a full user object when access with valid token.',
        profileTests.getOwnProfileWithValidToken
      );
      it(
        '- Should not return a user data when access without token.',
        profileTests.getOwnProfileWithoutToken
      );
      it(
        '- Should not return a user data when access with expired token.',
        profileTests.getOwnProfileWithExpiredToken
      );
      it(
        '- Should not return a user data when access with invalid token.',
        profileTests.getOwnProfileWithInvalidToken
      );
    });

    describe('- /Profile @ PUT', () => {
      it('- Should update testing user.', profileTests.updateTestingUser);
      it(
        '- Should not update testing user with invalid postal code.',
        profileTests.updateTestingUserWithInvalidPostalCode
      );
    });

    describe('- /Profile/:id @ GET', () => {
      it(
        '- Should return user information when accessing /profile/:id with valid token.',
        profileTests.getProfileByIdWithValidToken
      );
      it(
        '- Should not return user information when accessing /profile/:id with invalid token.',
        profileTests.getProfileByIdWithInvalidToken
      );
      it(
        '- Should not return user information when accessing /profile/:id with invalid ID.',
        profileTests.getProfileWithInvalidId
      );
    });
  });

  describe('# POSTS Testing ', () => {
    describe('- /Posts @ POST', () => {
      it('- Should create a new post.', postsTests.createPost);
      it(
        '- Should return error when token is invalid.',
        postsTests.createPostWithInvalidToken
      );
    });

    describe('- /Posts @ GET', () => {
      it('- Should get the user post.', postsTests.getPostByUserId);
    });

    describe('- /Posts/postalCode/:postalCode?distance=XXX @ GET', () => {
      it(
        "- Should return the Posts that are within a specific distance (query params 'distance') from the given postal code (url params).",
        postsTests.getPostsWithinDistanceAndPostalCode
      );
      it(
        "- Should not return the Posts that are not within the specific distance (query params 'distance') from the given postal code (url params).",
        postsTests.dontGetPostWithLowRange
      );
    });

    describe('- /Posts @ PUT', () => {
      it(
        '- Should update a test Post (created before).',
        postsTests.updatePost
      );
      it(
        '- Should not update a Post without required fields.',
        postsTests.updateWithoutRequiredFields
      );
      it(
        '- Should not update a non exising Post.',
        postsTests.updateNonExistingPost
      );
    });

    describe('- /Posts @ DELETE', () => {
      it(
        '- Should delete a test Post (created before).',
        postsTests.deletePost
      );
    });
  });

  describe('# AVAILABILITY Testing', () => {
    describe('- /Availabilty @ POST', () => {
      it(
        '- Should create a new availability.',
        availabilityTests.createAvailability
      );
    });

    describe('- /Availabilty @ GET', () => {
      it(
        '- Should get the post availability.',
        availabilityTests.getAvailability
      );
    });

    describe('- /Availabilty @ PUT', () => {
      it(
        '- Should update an existing availability.',
        availabilityTests.updateAvailability
      );
      it(
        '- Should not update when postId is not correct.',
        availabilityTests.updateAvailabilityWithIvaldPostId
      );
    });
  });
});
