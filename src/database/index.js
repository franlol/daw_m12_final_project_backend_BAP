const mongoose = require('mongoose');
const createTestingUser = require('../test/moked');

const dbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}:${process.env.DB_PORT}/${process.env.DB_COLLECTION}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    await createTestingUser();
  } catch (error) {
    console.log('DB Error: ', error);
  }
}

module.exports = dbConnection;
