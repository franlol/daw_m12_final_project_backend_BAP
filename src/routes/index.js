const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const profileRouter = require('./profile');
const postsRouter = require('./posts');
const messagesRouter = require('./messages');

router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/posts/messages', messagesRouter);
router.use('/posts', postsRouter);

module.exports = router;
