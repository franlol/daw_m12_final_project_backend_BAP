const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../database/models/User');

const verifyToken = require('./middlewares/auth');
const { checkUserFields, verifyUserFields, checkLoginFields } = require('./middlewares/fields');

const router = express.Router();

router.post('/signup', checkUserFields, verifyUserFields, async (req, res, next) => {
  const { username, name, surname, email, password, cp } = req.body;

  // TODO validate CP
  // TODO Create location from CP

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.status(409);
      return res.json({
        auth: false,
        message: 'Email already taken'
      });
    }

    const satRounds = 10;
    const hashedPassword = await bcrypt.hash(password, satRounds);

    const newUser = {
      username: username.toLowerCase(),
      name,
      surname,
      email,
      password: hashedPassword,
      cp,
      location: [12, 12]
    }

    const createdUser = await User.create(newUser);
    const leanUser = await User.findOne({ _id: createdUser._id }).lean();

    delete leanUser.password;

    const token = jwt.sign(leanUser, process.env.TOKEN_KEY, {
      expiresIn: '24h'
    });

    res.status(200);
    res.json({
      auth: true,
      message: 'User created',
      token
    });

  } catch (err) {
    next(err);
  }
});

router.post('/login', checkLoginFields, async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean();
    if (!user) {
      res.status(422);
      return res.json({
        auth: false,
        message: 'Email or password incorrect'
      });
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      res.status(422);
      return res.json({
        auth: false,
        message: 'Email or password incorrect'
      });
    }

    delete user.password;

    const token = jwt.sign(user, process.env.TOKEN_KEY, {
      expiresIn: '24h'
    });

    res.status(200);
    res.json({
      auth: true,
      token: `Bearer ${token}`
    });

  } catch (err) {
    next(err);
  }
});

router.get('/profile', verifyToken, (req, res) => {
  res.json({ 'user': res.user });
});

// TEMPORAL ROUTE to development purposes
router.delete('/delete/:username', async (req, res) => {
  const { username } = req.params;

  try {
    await User.deleteOne({ username });

    res.status(200);
    res.json({
      auth: true,
      message: `${username} deleted.`
    });
  } catch (error) {
    res.status(500);
    return res.json({
      message: `Error trying to delete user ${username}.`
    });
  }
});

module.exports = router;
