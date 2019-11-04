const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const { createUserTest, deleteUserTest, deleteUserUpdatedTest } = require('../test/moked');

const dbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}:${process.env.DB_PORT}/${process.env.DB_COLLECTION}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    await createUserTest();
    await deleteUserUpdatedTest();
  } catch (error) {
    console.log('DB Error: ', error);
  }
}

module.exports = dbConnection;
