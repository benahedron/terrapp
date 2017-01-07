'use strict';

import mongoose from 'mongoose';

var SeasonSchema = new mongoose.Schema({
  year: Number,
  active: {type: Boolean, default: false},
  eventInterval: {type: Number, default: 7}
});

export default mongoose.model('Season', SeasonSchema);
