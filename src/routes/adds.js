const express = require('express');
const Add = require('../database/models/Add');
const verifyToken = require('./middlewares/auth');

const router = express.Router();

router.post('/', verifyToken, (req, res, next) => {
  if (!req.session.user) {
    res.status(400);
    return res.json({
      message: 'Not logged'
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
    price
  });

  return add
    .save()
    .then(rs => {
      res.status(201).json(add);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
