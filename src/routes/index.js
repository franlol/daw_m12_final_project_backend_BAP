const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const profileRouter = require('./profile');
const anunciRouter = require('./anunci');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/anunci', anunciRouter);

module.exports = router;
