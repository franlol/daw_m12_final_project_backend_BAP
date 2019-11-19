const express = require('express');
const mongoose = require('mongoose');

const Add = require('../database/models/Add');
const verifyToken = require('./middlewares/auth');

const router = express.Router();

router.post('/', verifyToken, (req, res, next) => {
  if (!req.session.user) {
    res.status(400);
    return res.json({
      message: 'Not logged.'
    });
  }

  const title = req.body.title;
  const description = req.body.description;
  const range = req.body.range;
  const services = {
    babysitter: true,
    classes: true,
    cleaner: true,
    pets: true
  }

  const price = req.body.price;

  const owner = req.session.user._id;

  const add = new Add({
    owner,
    title,
    description,
    range,
    services,
    price
  });

  return add
    .save()
    .then(rs => {
      res.status(201).json(add);
    })
    .catch(err => res.status(500).json(err));
});

router.delete('/:id', verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const { user } = req.session;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422);
      return res.json({
        message: 'Invalid Ad ID.'
      });
    }

    const ad = await Add.findById(id).populate('owner').lean();

    if (!ad.owner._id.equals(user._id)) {
      res.status(401);
      return res.json({
        message: 'You cannot delete that ad.'
      });
    }

    await Add.findByIdAndDelete(id);

    res.status(200);
    return res.json({
      message: 'Ad removed.'
    });

  } catch (err) {
    next(err)
  }
});

// router.get('/cerca', async (req, res, next) => {
//   const anuncis = await Add.find().populate('owner').select('-password');
//   console.log('anuncis', anuncis)

//   res.status(200);
//   return res.json(anuncis);
// });

module.exports = router;
