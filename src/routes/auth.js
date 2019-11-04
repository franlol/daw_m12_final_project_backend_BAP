const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const z1p = require("z1p");

const User = require('../database/models/User');

const verifyToken = require('./middlewares/auth');
const { checkUserFields, verifyUserFields, checkLoginFields } = require('./middlewares/fields');

const router = express.Router();

router.post('/signup', checkUserFields, verifyUserFields, async (req, res, next) => {
  const { username, name, surname, email, password, cp } = req.body;

  try {
    const location = await z1p(["ES"]).raw(v => v.zip_code == cp)[0];
    if (!location || location.length === 0) {
      res.status(422);
      return res.json({
        auth: false,
        message: 'Invalid spanish zipcode'
      });
    }

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
      location: {
        type: 'Point',
        coordinates: [location.latitude, location.longitude],
        place: location.place,
        country_code: location.country_code,
        state_code: location.state_code,
        state: location.state,
        province: location.province,
        place: location.place
      }
    }

    const createdUser = await User.create(newUser);
    const leanUser = await User.findOne({ _id: createdUser._id }).lean();
    // TODO select -password
    delete leanUser.password;

    const token = jwt.sign(leanUser, process.env.TOKEN_KEY, {
      expiresIn: '24h'
    });

    req.session.user = leanUser;

    res.status(200);
    res.json({
      auth: true,
      message: 'User created',
      token: `Bearer ${token}`
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

    req.session.user = user;

    res.status(200);
    res.json({
      auth: true,
      token: `Bearer ${token}`
    });

  } catch (err) {
    next(err);
  }
});

router.post('/logout', verifyToken, (req, res) => {
  delete req.session.user;

  res.status(200);
  res.json({
    auth: false,
    message: 'Logged out'
  });
});

// TEMPORAL ROUTE for development purposes
router.delete('/delete/:email', async (req, res) => {
  const { email } = req.params;

  try {
    await User.deleteOne({ email });

    res.status(200);
    res.json({
      auth: true,
      message: `${email} deleted.`
    });
  } catch (error) {
    res.status(500);
    return res.json({
      message: `Error trying to delete user ${email}.`
    });
  }
});

module.exports = router;
