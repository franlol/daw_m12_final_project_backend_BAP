const request = require('supertest');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const app = require('../app');
const data = require('./config');

const { getToken, getUser } = require('./utils.js');
const { createUserTest } = require('./moked');

let post = null;

const createPost = async () => {
  await createUserTest();
  const token = await getToken(data.user.email, data.user.password);
  const loggedUser = await getUser(token);
  const res = await request(app)
    .post('/posts')
    .set({ ['access-token']: `Bearer ${token}` })
    .send({
      owner: loggedUser._id,
      title: 'Test Post',
      description: 'This is a test post',
      range: 5,
      services: {
        babysitter: true,
        classes: true,
        cleaner: false,
        pets: false
      },
      price: 25
    });

  post = res.body;
  expect(res.status).toEqual(201);
};

const createPostWithInvalidToken = async () => {
  const token = process.env.TEST_EXPIRED_TOKEN;
  const loggedUser = await getUser(token);
  const res = await request(app)
    .post('/posts')
    .set({ ['access-token']: `Bearer 123456` })
    .send({
      owner: loggedUser._id,
      title: 'Test Post',
      description: 'This is a test post',
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

const getPostByUserId = async () => {
  const token = await getToken(data.user.email, data.user.password);
  const loggedUser = await getUser(token);

  const res = await request(app)
    .get(`/posts/${loggedUser._id}`)
    .set({ ['access-token']: `Bearer ${token}` });

  expect(res.status).toEqual(200);
  expect(res.body.post).toHaveProperty('title', 'Test Post');
  expect(res.body.post).toHaveProperty('description', 'This is a test post');
  expect(res.body.post).toHaveProperty('range', 5);
  expect(res.body.post).toHaveProperty('price', 25);
};

const getPostsWithinDistanceAndPostalCode = async () => {
  const token = await getToken(data.user.email, data.user.password);
  const loggedUser = await getUser(token);

  const res = await request(app)
    .get('/posts/postalCode/08720?distance=6')
    .set({ ['access-token']: `Bearer ${token}` });

  const ourPost = res.body.posts.filter(post => {
    return loggedUser._id === post.owner._id;
  });

  expect(res.status).toEqual(200);
  expect(ourPost.length).toBeGreaterThanOrEqual(1);
  expect(ourPost[0]).toHaveProperty('title', 'Test Post');
  expect(ourPost[0]).toHaveProperty('description', 'This is a test post');
  expect(ourPost[0]).toHaveProperty('range', 5);
  expect(ourPost[0]).toHaveProperty('price', 25);
};

const dontGetPostWithLowRange = async () => {
  const token = await getToken(data.user.email, data.user.password);
  const loggedUser = await getUser(token);

  const res = await request(app)
    .get('/posts/postalCode/08720?distance=2')
    .set({ ['access-token']: `Bearer ${token}` });

  const ourPost = res.body.posts.filter(ad => {
    return loggedUser._id === post.owner;
  });

  expect(res.status).toEqual(200);
  expect(ourPost.length).toBe(0);
};

const deletePost = async () => {
  const token = await getToken(data.user.email, data.user.password);

  const res = await request(app)
    .delete(`/posts/${post._id}`)
    .set({ ['access-token']: `Bearer ${token}` });

  expect(res.status).toEqual(200);
};

const updatePost = async () => {
  const token = await getToken(data.user.email, data.user.password);

  const res = await request(app)
    .put(`/posts/${post._id}`)
    .set({ ['access-token']: `Bearer ${token}` })
    .send({
      title: 'Test Post updated',
      description: 'This is a test post updated',
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
    expect(res.body.message).toEqual('Post updated');
}

const updateWithoutRequiredFields = async () => {
  const token = await getToken(data.user.email, data.user.password);

  const res = await request(app)
    .put(`/posts/${post._id}`)
    .set({ ['access-token']: `Bearer ${token}` })
    .send({
      range: 10,
      services: {
        babysitter: false,
        classes: false,
        cleaner: true,
        pets: true
      },
      price: 50
    });

    expect(res.status).toEqual(422);
    expect(res.body.message).toEqual('Title and description are required');
}

const updateNonExistingPost = async () => {
  const token = await getToken(data.user.email, data.user.password);

  const res = await request(app)
    .put(`/posts/5dfde987ebae9a0d74b2ce74`)
    .set({ ['access-token']: `Bearer ${token}` })
    .send({
      title: 'Test Post updated',
      description: 'This is a test post updated',
      range: 10,
      services: {
        babysitter: false,
        classes: false,
        cleaner: true,
        pets: true
      },
      price: 50
    });

    expect(res.status).toEqual(404);
    expect(res.body.message).toEqual('Post not found.');
}

module.exports = {
  createPost,
  createPostWithInvalidToken,

  getPostByUserId,

  getPostsWithinDistanceAndPostalCode,
  dontGetPostWithLowRange,

  deletePost,

  updatePost,
  updateWithoutRequiredFields,
  updateNonExistingPost
};
