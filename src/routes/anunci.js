const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Anunci = require('../database/models/Anunci');

router.post('/', (req, res, next) => {
  if (!req.session.user) {
    res.status(400);
    return res.json({
      message: 'Not logged'
    });
  }

  const title = req.body.title;
  const description = req.body.description;
  const rang = req.body.rang;
  const services = req.body.services;
  const price = req.body.price;

  const owner = req.session.user._id;

  const anunci = new Anunci({
    owner,
    title,
    description,
    rang,
    services,
    price
  });

  return anunci
    .save()
    .then(rs => {
      res.status(201).json(anunci);
    })
    .catch(err => res.status(500).json(err));
});
