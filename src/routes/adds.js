const express = require('express');
const mongoose = require('mongoose');

const Add = require('../database/models/Add');
const verifyToken = require('./middlewares/auth');
const { verifyZipcodeInParams } = require('./middlewares/zipcodes');

const router = express.Router();
const distanceBetween = require('../utils/haversine');

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
  const services = req.body.services;

  const price = req.body.price;

  const owner = req.session.user._id;

  const add = new Add({
    owner,
    title,
    description,
    range,
    services,
    price,
    location: req.session.user.location
  });

  return add
    .save()
    .then(rs => {
      res.status(201).json(add);
    })
    .catch(err => res.status(500).json(err));
});

router.get('/:userId', verifyToken, async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(422);
      return res.json({
        message: 'Invalid Ad ID'
      });
    }

    const ad = await Add.findOne({ owner: userId });
    if (!ad) {
      res.status(404);
      return res.json({
        message: 'Ad not found.'
      });
    }

    res.status(200);
    return res.json({ ad });
  } catch (err) {
    next(err);
  }
});

router.get('/cp/:cp', verifyZipcodeInParams, verifyToken, async (req, res, next) => {
  try {
    // If the distance in the query params is lower than 500km, we keep it up. Else, we fix it to 50km. (* 1000 because 1km equals 1000m)
    const distanceToSearch = req.query.distance && (req.query.distance < 500 ? req.query.distance : 50) * 1000;
    const coordinates = [res.location.latitude, res.location.longitude]

    const ads = await Add.find({
      location: {
        $near: {
          $maxDistance: distanceToSearch,
          $geometry: {
            type: "Point",
            coordinates
          }
        }
      }
    }).populate('owner', 'username _id');

    const [zipcodeLat, zipcodeLon] = coordinates;

    const filteredAnuncis = ads.filter(ad => {
      const [adLat, adLon] = ad.location.coordinates;
      return ad.range >= Math.floor(distanceBetween([zipcodeLat, zipcodeLon], [adLat, adLon]));
    });

    res.status(200);
    return res.json({
      ads: filteredAnuncis
    });
  } catch (err) {
    next(err);
  }
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

    const ad = await Add.findById(id)
      .populate('owner')
      .lean();

    if (!ad) {
      res.status(404);
      return res.json({
        message: 'Ad not found.'
      });
    }

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
    next(err);
  }
});

router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const test = await Add.findOneAndUpdate({ _id: req.body._id }, req.body);

    console.log(test)

    res.status(200);
    res.json({
      message: 'Ad updated',
    });
    
  } catch (err) {
    next(err);
  }
}

);

module.exports = router;
