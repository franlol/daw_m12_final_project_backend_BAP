const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../database/models/User');

const verifyToken = require('./middlewares/auth');
const { checkUserFields, verifyUserFields } = require('./middlewares/fields');

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

router.post('/', verifyToken, checkUserFields, verifyUserFields, async (req, res, next) => {
  try {
    delete req.body.password;
    await User.findOneAndUpdate({ _id: req.session.user._id }, { ...req.body }).select("-password");

    const updated = {
      ...req.session.user,
      ...req.body
    }

    delete updated.exp;
    const token = jwt.sign(updated, process.env.TOKEN_KEY, {
      expiresIn: '24h'
    });

    req.session.user = updated;

    res.status(200);
    res.json({
      message: `User updated`,
      token,
      updatedUser: req.session.user
    });

  } catch (err) {
    next(err);
  }
});

router.get('/:id', verifyToken, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422);
      return res.json({
        message: 'Invalid ID.'
      });
    }

    // 5c790021e26c13412e8d7f9a
    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404);
      return res.json({
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
