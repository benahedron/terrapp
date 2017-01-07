'use strict';

import mongoose, {Schema} from 'mongoose';

var PickupEventSchema = new mongoose.Schema({
  season: {type: Schema.Types.ObjectId, ref: 'Membership'},
  pickupOption: {type: Schema.Types.ObjectId, ref: 'PickupOption'},
  eventNumber: Number,
  adminNote: String,
  adminPickupOptionOverride: {type: Schema.Types.ObjectId, ref: 'PickupOption'},
  weekdayOverride: {type: Number, default: null},
  startMinuteOverride: {type: Number, default: null},
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
