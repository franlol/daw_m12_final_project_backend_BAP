const express = require('express');
const bcrypt = require('bcrypt');
const emailRegex = require('email-regex');
const jwt = require('jsonwebtoken');

const User = require('../database/models/User');
const router = express.Router();
const verifyToken = require('./middlewares/auth');

router.post('/signup', async (req, res, next) => {
  // POST = body
  // GET = query
  // PARAMETRE = params
  const { username, name, surname, email, password, location } = req.body;

  if (!username || !name || !surname || !email || !password || !location) {
    res.status(422);
    return res.json({
      message: 'All fields are required'
    });
  }

  const onlyLettersRegex = new RegExp("^[a-zA-Z]+$");

  const validUsername = (username.length > 3 && onlyLettersRegex.test(username));

  if (!validUsername) {
    res.status(422);
    return res.json({
      message: 'Invalid username'
    });
  }

  const lowerUsername = username.toLowerCase();

  const validEmail = emailRegex({ exact: true }).test(email);

  if (!validEmail) {
    res.status(422);
    return res.json({
      message: 'Invalid email'
    });
  }

  //More than 8 characters, 1 lowercase letter, 1 uppercase letter and 1 digit
  const passRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");

  const validPass = passRegex.test(password);

  if (!validPass) {
    res.status(422);
    return res.json({
      message: 'Invalid password'
    });
  }

  //TODO validate location??

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.status(409);
      return res.json({
        message: 'Email already taken'
      });
    }

    const satRounds = 10;
    const hashedPassword = await bcrypt.hash(password, satRounds);

    const newUser = {
      username: lowerUsername,
      name,
      surname,
      email,
      password: hashedPassword,
      location
    }

    await User.create(newUser);
    delete newUser.password;

    const token = jwt.sign(newUser, process.env.TOKEN_KEY, {
      expiresIn: '24h'
    });

    console.log(token);

    res.status(200);
    res.json({
      message: 'User created',
      token
    });

  } catch (err) {
    next(err);
  }

});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422);
    return res.json({
      message: 'Email and password are required.'
    });
  }

  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      res.status(422);
      return res.json({
        message: 'Email or password incorrect'
      });
    }

    const hashedPassword = await bcrypt.compare(password, user.password);

    if (!hashedPassword) {
      res.status(422);
      return res.json({
        message: 'Email or password incorrect'
      });
    }

    delete user.password;

    const token = jwt.sign(user, process.env.TOKEN_KEY, {
      expiresIn: '24h'
    });

    res.status(200);
    res.json({
      message: 'User logged in',
      token
    });

  } catch (err) {
    next(err);
  }

});

router.get('/profile', verifyToken, (req, res) => {
  res.json({ 'user': res.user });
});

module.exports = router;
