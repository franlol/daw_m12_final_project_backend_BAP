'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
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
      // lat long
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: [Number],
      place: {
        type: String,
        required: true
      },
      country_code: {
        type: String,
        required: true
      },
      state_code: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      province: {
        type: String,
        required: true
      },
      place: {
        type: String,
        required: true
      }
    },
    cp: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ location: '2dsphere' });
const User = mongoose.model('User', userSchema);

module.exports = User;
