'use strict';

import mongoose from 'mongoose';

var PickupOptionSchema = new mongoose.Schema({
  name: String,
  geoUri: String,
  address: String,
  weekDay: Number,
  startMinute: Number,
  durationMinutes: Number,
  hoursBeforeLocking: {type: Number, default: 12},
  active: {type: Boolean, default: true}
});

export default mongoose.model('PickupOption', PickupOptionSchema);
