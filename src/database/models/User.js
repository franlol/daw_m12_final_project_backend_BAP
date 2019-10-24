'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: { type: String },
    coordinates: [Number]
  }
},
  {
    timestamps: true
  });

userSchema.index({ location: '2dsphere' });
const User = mongoose.model('User', userSchema);

module.exports = User;
