'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const addSchema = new Schema(
  {
    owner: {
      type: ObjectId,
      ref: 'User'
    },
    title: String,
    description: String,
    range: Number,
    services: {
      babysitter: Boolean,
      classes: Boolean,
      cleaner: Boolean,
      pets: Boolean
    },
    price: Number
  },
  {
    timestamps: true
  }
);

const Add = mongoose.model('Add', addSchema);

module.exports = Add;
