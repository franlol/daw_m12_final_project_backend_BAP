const request = require('supertest');
const app = require('../app');

const getToken = async (email, password) => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email,
      password
    });

  return res.body.token.split(' ')[1];
};

getUser = async token => {
  const res = await request(app)
    .get('/profile')
    .set({ ['access-token']: `Baerer ${token}` });
  return res.body;
};

getPost = async token => {
  const user = await getUser(token);
  const res = await request(app)
    .get(`/posts/${user._id}`)
    .set({ ['access-token']: `Bearer ${token}` });
  return res.body.post;
};

module.exports = { getToken, getUser, getPost };
