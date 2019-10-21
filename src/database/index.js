const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    // TODO environment varialbes
    // process.env.DB_URI
    await mongoose.connect('mongodb://localhost:27017/BAP', {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  } catch (error) {
    console.log('DB Error: ', error);
  }
}

module.exports = dbConnection;
