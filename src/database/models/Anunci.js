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
    descripcio: String,
    rang: Number
  },
  {
    timestamps: true
  }
);

const Anunci = mongoose.model('Anunci', anunciSchema);

module.exports = Anunci;
