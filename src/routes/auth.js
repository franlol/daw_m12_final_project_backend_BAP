const express = require('express');

const User = require('../database/models/User');
const router = express.Router();

router.post('/signup', async (req, res, next) => {
  // POST = body
  // GET = query
  // PARAMETRE = params
  const { userName, name, surname, email, password, location } = req.body;

  if (!userName || !name || !surname || !email || !password || !location) {
    res.status(404); //TODO
    res.json({
      message: 'All fields are required'
    });
  }

  // Todo check fields


  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(404); //TODO
      res.json({
        message: 'Email already taken'
      });
    }
    const newUser = {
      userName,
      name,
      surname,
      email,
      password,
      location
    }
    // TODO encrypt password

    const userCreated = await User.create(newUser);
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



module.exports = router;
