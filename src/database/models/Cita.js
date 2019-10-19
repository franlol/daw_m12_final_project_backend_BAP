'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const citaSchema = new Schema(
  {
    owner: {
      type: ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Cita = mongoose.model('Cita', citaSchema);
module.exports = Cita;
