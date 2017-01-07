'use strict';

import mongoose from 'mongoose';

var PickupOptionSchema = new mongoose.Schema({
  name: String,
  locationUrl: String,
  weekDay: Number,
  startMinute: Number,
  durationMinutes: Number,
  hoursBeforeLocking: Boolean,
  active: Boolean
});

export default mongoose.model('PickupOption', PickupOptionSchema);
