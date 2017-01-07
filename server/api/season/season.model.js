'use strict';

import mongoose from 'mongoose';

var SeasonSchema = new mongoose.Schema({
  year: Number,
  active: {type: Boolean, default: false},
  eventIntervalInDays: {type: Number, default: 7},
  eventIntervalOffset: {type: Number, default: 0},
  firstEventOffset: {type: Number, default: 0},
  lastEventOffset: {type: Number, default: 52},
});

export default mongoose.model('Season', SeasonSchema);
