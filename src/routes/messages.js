const express = require('express');
const mongoose = require('mongoose');

const Post = require('../database/models/Post');
const Message = require('../database/models/Message');

const verifyToken = require('./middlewares/auth');

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  const { message, userId: profileId, title } = req.body;

  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    res.status(422);
    return res.json({
      message: 'Invalid User ID'
    });
  }

  try {
    if (!message || message.length <= 0 || !title || title.length <= 0) {
      res.status(422);
      res.json({
        message: 'Invalid body.'
      });
    }

    const post = await Post.findOne({ owner: profileId });
    if (!post) return res.status(204).end();

    const newMessage = await Message.create({
      postId: post._id,
      userId: req.session.user._id,
      text: message,
      title,
      status: false
    });

    await newMessage.populate('userId', 'image username').execPopulate();

    res.status(200);
    res.json({
      message: 'Message added.',
      newMessage
    });

  } catch (error) {

    res.status(500);

    return res.json({
      message: `Error trying to add a message.`
    });

  }
});

router.get('/:profileId', verifyToken, async (req, res) => {
  try {
    const { profileId } = req.params;
    const post = await Post.findOne({ owner: profileId });
    if (!post) return res.status(204).end();

    const messages = await Message.find({ postId: post._id }).populate('userId', 'image username');

    res.status(200);
    res.json({
      messages
    });

  } catch (error) {

    res.status(500);

    return res.json({
      message: `Error trying to get all messages.`
    });

  }
});


router.put('/:id', verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const { postId } = req.body;
  const { user } = req.session;

  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(422);
      return res.json({
        message: 'Invalid Post ID.'
      });
    }

    const message = await Message.findById(id)
      .populate(postId)
      .lean();

    if (!message) {
      res.status(404);
      return res.json({
        message: 'Message not found'
      });
    }

    const post = await Post.findById(message.postId)
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

    await Message.findOneAndUpdate({ _id: id }, req.body);

    res.status(200);
    res.json({
      message: 'Message updated'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
