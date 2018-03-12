'use strict';

import mongoose from 'mongoose';

var ExtraOptionSchema = new mongoose.Schema({
  name: {type: String, default: null},
  note: {type: String, default: null},
  unit: {type: String, default: null}
});

var SeasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  firstEventDate: {type: Date},
  numberOfEvents: {type: Number, default: 52},
  eventIntervalInDays: {type: Number, default: 7},
  activePickupOptions: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'PickupOption'}
  ],
  availableExtras: [ExtraOptionSchema]
});

mongoose.model('ExtraOption', ExtraOptionSchema);
export default mongoose.model('Season', SeasonSchema);
