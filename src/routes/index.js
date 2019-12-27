const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const profileRouter = require('./profile');
const postsRouter = require('./posts');
const availabilityRouter = require('./availability');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/posts', postsRouter);
router.use('/availability', availabilityRouter);

module.exports = router;
