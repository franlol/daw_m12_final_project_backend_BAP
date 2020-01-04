const express = require('express');
const mongoose = require('mongoose');

const Availability = require('../database/models/Availability');
const verifyToken = require('./middlewares/auth');

const router = express.Router();

router.post('/', verifyToken, (req, res, next) => {
  if (!req.session.user) {
    res.status(400);
    return res.json({
      message: 'Not logged.'
    });
  }

  const calendar = req.body.calendar;
  const postId = req.body.postId;
  const owner = req.session.user._id;

  const availability = new Availability({
    owner,
    postId,
    calendar
  });

  return availability
    .save()
    .then(rs => {
      res.status(201).json({ calendar: availability.calendar });
    })
    .catch(err => res.status(500).json(err));
});

router.get('/:postId', verifyToken, async (req, res, next) => {
  const { postId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(422);
      return res.json({
        message: 'Invalid Post Id'
      });
    }

    const availability = await Availability.findOne({ postId });
    if (!availability) return res.status(204).end();
    res.status(200);
    return res.json({ calendar: availability.calendar });
  } catch (err) {
    next(err);
  }
});

router.put('/:postId', verifyToken, async (req, res, next) => {
  const { postId } = req.params;
  const calendar = req.body.calendar;
  const { user } = req.session;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(422);
      return res.json({
        message: 'Invalid Post Id'
      });
    }

    const availability = await Availability.findOne({ postId });

    if (!availability.owner.equals(user._id)) {
      res.status(401);
      return res.json({
        message: 'You can not update the availability'
      });
    }

    await Availability.findOneAndUpdate({ postId }, { calendar });

    res.status(200);
    return res.json({
      message: 'Availability updated'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
