'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const appointmentSchema = new Schema(
  {
    owner: {
      type: ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      required: true
    },
    userSubscribedId: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    discount: Boolean
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
