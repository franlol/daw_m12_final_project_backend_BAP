const User = require('../database/models/User');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const createUserTest = async () => {
  const testUser = await User.findOne({ email: process.env.TEST_EMAIL });

  if (!testUser) {
    const satRounds = 10;
    const hashedPassword = await bcrypt.hash(process.env.TEST_PASSWORD, satRounds);

    const mokedUser = {
      username: 'testuser',
      name: 'User for Jest tests',
      surname: 'test',
      email: process.env.TEST_EMAIL,
      password: hashedPassword,
      cp: '08730',
      location: {
        type: 'Point',
        coordinates: [41.3324, 1.6496],
        place: 'Santa Margarida I Els Monjos',
        country_code: 'ES',
        state_code: 'CT',
        state: 'Cataluna',
        province: 'Barcelona',
        place: 'Santa Margarida I Els Monjos'
      }
    }
    await User.create(mokedUser);
  }

  const signupUser = await User.findOne({ email: `${process.env.TEST_EMAIL}a` });
  if (signupUser) await User.deleteOne(signupUser);
}

const deleteUserTest = async () => {
  const user = await User.findOne({ email: `${process.env.TEST_EMAIL}` });
  if (user) await User.deleteOne({ email: user.email });
}

const deleteUserUpdatedTest = async () => {
  const updatedUser = await User.findOne({ email: `a${process.env.TEST_EMAIL}` });
  if (updatedUser) await User.deleteOne({ email: updatedUser.email });
}

module.exports = { createUserTest, deleteUserTest, deleteUserUpdatedTest };
