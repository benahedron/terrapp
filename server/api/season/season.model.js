'use strict';

import mongoose from 'mongoose';

var SeasonSchema = new mongoose.Schema({
  name: String,
  active: {type: Boolean, default: false},
  firstEventDate: {type: Date},
  numberOfEvents: {type: Number, default: 52},
  eventIntervalInDays: {type: Number, default: 7},
});

export default mongoose.model('Season', SeasonSchema);
