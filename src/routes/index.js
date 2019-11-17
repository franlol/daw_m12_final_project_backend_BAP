const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const profileRouter = require('./profile');
const addsRouter = require('./adds');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/adds', addsRouter);

module.exports = router;
