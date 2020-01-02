const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../database/models/User');
const Post = require('../database/models/Post');

const { verifyPostalCodeInBody } = require('./middlewares/postalCodes');
const verifyToken = require('./middlewares/auth');
const {
  updateProfileUserFields,
  updateProfileVerifyUserFields
} = require('./middlewares/fields');

router.get('/', verifyToken, (req, res) => {
  const { user } = req.session;

  if (!user) {
    res.status(400);
    return res.json({
      message: 'Not logged'
    });
  }

  res.status(200);
  res.json(user);
});

router.put(
  '/',
  verifyToken,
  updateProfileUserFields,
  updateProfileVerifyUserFields,
  verifyPostalCodeInBody,
  async (req, res, next) => {
    try {
      delete req.body.password;
      const { location } = res;
      await User.findOneAndUpdate(
        { _id: req.session.user._id },
        {
          ...req.body,
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
      ).select('-password');

      const updated = {
        ...req.session.user,
        ...req.body,
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
      };

      delete updated.exp;
      const token = jwt.sign(updated, process.env.TOKEN_KEY, {
        expiresIn: '24h'
      });

      req.session.user = updated;

      res.status(200);
      res.json({
        message: `User updated`,
        token: `Bearer ${token}`,
        updatedUser: req.session.user
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:id', verifyToken, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422);
      return res.json({
        code: 10,
        message: 'Invalid ID.'
      });
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(404);
      return res.json({
        code: 11,
        message: 'User not found.'
      });
    }

    res.status(200);
    res.json({
      user
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
