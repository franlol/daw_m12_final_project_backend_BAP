const User = require('../database/models/User');
const bcrypt = require('bcrypt');

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
      cp: '00000',
      location: [0, 0]
    }
    await User.create(mokedUser);
  }

  const signupUser = await User.findOne({ email: `${process.env.TEST_EMAIL}a` });
  if (signupUser) await User.deleteOne(signupUser);
}

module.exports = createUserTest;
