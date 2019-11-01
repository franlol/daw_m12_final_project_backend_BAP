const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const profileRouter = require('./profile');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);

module.exports = router;
