const express = require('express');
const bcrypt = require('bcrypt');
const emailRegex = require('email-regex');

const User = require('../database/models/User');
const router = express.Router();

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

  const validUsername = username.length > 3;

  if (!validUsername) {
    res.status(422);
    return res.json({
      message: 'Invalid username'
    });
  }

  const validEmail = emailRegex({ exact: true }).test(email);

  if (!validEmail) {
    res.status(422);
    return res.json({
      message: 'Invalid email'
    });
  }

  //More than 8 characters, 1 lowercase letter, 1 uppercase letter and 1 digit
  const passRegex = '(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$';

  const validPass = passRegex.test(password);
  
  if(!validPass){
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
      username,
      name,
      surname,
      email,
      password: hashedPassword,
      location
    }

    await User.create(newUser);

    //TODO crear token
    const token = 'asdasd';

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

  // CHeck fields

  if (!email || !password) {
    res.status(404); // TODO
    return res.json({
      message: 'Email and password are required.'
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404); // TODO
      return res.json({
        message: 'Email or password incorrect'
      });
    }

    const hashedPassword = await bcrypt.compare(password, user.password);

    if (!hashedPassword) {
      res.status(404); // TODO
      return res.json({
        message: 'Email or password incorrect'
      });
    }

    // TODO create token
    const token = 'asdasdsa8asd8';

    res.status(200);
    res.json({
      message: 'User logged in',
      token
    });

  } catch (error) {
    next(err);
  }

});

module.exports = router;
