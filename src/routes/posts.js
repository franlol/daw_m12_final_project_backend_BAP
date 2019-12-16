const express = require('express');
const mongoose = require('mongoose');

const Post = require('../database/models/Post');
const verifyToken = require('./middlewares/auth');
const { verifyPostalCodeInParams } = require('./middlewares/postalCodes');

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

  const post = new Post({
    owner,
    title,
    description,
    range,
    services,
    price,
    location: req.session.user.location
  });

  return post
    .save()
    .then(rs => {
      res.status(201).json(post);
    })
    .catch(err => res.status(500).json(err));
});

router.get('/:userId', verifyToken, async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(422);
      return res.json({
        message: 'Invalid User ID'
      });
    }

    const post = await Post.findOne({ owner: userId });
    if (!post) return res.status(204).end();

    res.status(200);
    return res.json({ post });
  } catch (err) {
    next(err);
  }
});

router.get(
  '/postalCode/:postalCode',
  verifyPostalCodeInParams,
  verifyToken,
  async (req, res, next) => {
    try {
      // If the distance in the query params is lower than 500km, we keep it up. Else, we fix it to 50km. (* 1000 because 1km equals 1000m)
      const distanceToSearch =
        req.query.distance &&
        (req.query.distance < 500 ? req.query.distance : 50) * 1000;
      const coordinates = [res.location.latitude, res.location.longitude];

      const posts = await Post.find({
        location: {
          $near: {
            $maxDistance: distanceToSearch,
            $geometry: {
              type: 'Point',
              coordinates
            }
          }
        }
      }).populate('owner', 'username _id');

      const [postalCodeLat, postalCodeLon] = coordinates;

      const filteredAnuncis = posts.filter(post => {
        const [postLat, postLon] = post.location.coordinates;
        return (
          post.range >=
          Math.floor(
            distanceBetween([postalCodeLat, postalCodeLon], [postLat, postLon])
          )
        );
      });

      res.status(200);
      return res.json({
        posts: filteredAnuncis
      });
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:id', verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const { user } = req.session;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422);
      return res.json({
        message: 'Invalid Post ID.'
      });
    }

    const post = await Post.findById(id)
      .populate('owner')
      .lean();

    if (!post) {
      res.status(404);
      return res.json({
        message: 'Post not found.'
      });
    }

    if (!post.owner._id.equals(user._id)) {
      res.status(401);
      return res.json({
        message: 'You cannot delete that post.'
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200);
    return res.json({
      message: 'Post removed.'
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', verifyToken, async (req, res, next) => {

  const { id, title, description } = req.params;
  const { user } = req.session;

  try {
        
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422);
      return res.json({
        message: 'Invalid Post ID.'
      });
    }

    if(!title || !description){
      res.status(422);
      return res.json({
        message:'Title and description are required'
      });
    }

    const post = await Post.findById(id)
      .populate('owner')
      .lean();

    if (!post) {
      res.status(404);
      return res.json({
        message: 'Post not found.'
      });
    }

    if (!post.owner._id.equals(user._id)) {
      res.status(401);
      return res.json({
        message: 'You cannot update that post.'
      });
    }

    const test = await Post.findOneAndUpdate({ _id: req.body._id }, req.body);

    console.log(test);

    res.status(200);
    res.json({
      message: 'Post updated'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
