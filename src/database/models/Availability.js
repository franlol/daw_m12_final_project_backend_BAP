'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const availabilitySchema = new Schema(
  {
    postId: {
      type: ObjectId,
      ref: 'Post',
      required: true
    },
    owner: {
      type: ObjectId,
      ref: 'User'
    },
    calendar: {
      fh1: [Boolean],
      fh2: [Boolean],
      fh3: [Boolean],
      fh4: [Boolean],
      fh5: [Boolean],
      fh6: [Boolean],
      fh7: [Boolean],
      fh8: [Boolean]
    }
  },
  {
    timestamps: true
  }
);

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
