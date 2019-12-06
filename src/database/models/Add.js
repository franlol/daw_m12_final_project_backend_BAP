'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const addSchema = new Schema({
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
  price: Number,
  location: {
    type: {
      type: String
    },
    coordinates: [Number]
  }
},
  {
    timestamps: true
  }
);

addSchema.index({ location: '2dsphere' });
const Add = mongoose.model('Add', addSchema);

module.exports = Add;
