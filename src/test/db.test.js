const request = require('supertest');
const dotenv = require('dotenv');

const app = require('../app');
const dbConnection = require('../database')
const data = require('./config');

dotenv.config();

describe('/LOGIN testing', () => {
  let db;

  beforeAll(async () => {
    db = await dbConnection();
  });

  afterAll(async () => {
    await dbConnection.close();
    dbConnection.disconnect();
    await db.close();
  });

});
