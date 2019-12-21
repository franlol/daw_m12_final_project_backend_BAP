'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv');
dotenv.config({ path: process.env.INIT_CWD + '/.env' });

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
    image: {
      type: String,
      required: false,
      default: process.env.USER_DEFAULT_IMAGE
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
    postalCode: {
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
