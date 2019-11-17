'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const anunciSchema = new Schema(
  {
    owner: {
      type: ObjectId,
      ref: 'User'
    },
    title: String,
    description: String,
    rang: Number,
    services: {
      cangur: Boolean,
      classes: Boolean,
      neteja: Boolean,
      mascotes: Boolean
    },
    price: Number
  },
  {
    timestamps: true
  }
);

const Anunci = mongoose.model('Anunci', anunciSchema);

module.exports = Anunci;
