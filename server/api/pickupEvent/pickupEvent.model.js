'use strict';

import mongoose, {Schema} from 'mongoose';

var PickupEventSchema = new mongoose.Schema({
  season: {type: Schema.Types.ObjectId, ref: 'Season'},
  pickupOption: {type: Schema.Types.ObjectId, ref: 'PickupOption'},
  eventNumber: Number,
  adminNote: {type: String, default: null},
  pickupOptionOverride: {type: Schema.Types.ObjectId, ref: 'PickupOption', default: null},
  startDateOverride: {type: Date, default: null},
  durationMinutesOverride: {type: Number, default: null},
  canceled: {type: Boolean, default: false},
  mails: [
    {
      date: Date,
      message: String
    }
  ]
});

export default mongoose.model('PickupEvent', PickupEventSchema);
