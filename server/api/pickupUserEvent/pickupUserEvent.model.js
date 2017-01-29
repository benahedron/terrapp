'use strict';

import mongoose, {Schema} from 'mongoose';

var PickupUserEventSchema = new mongoose.Schema({
  pickupEvent: {type: Schema.Types.ObjectId, ref: 'PickupEvent'},
  basket: {type: Schema.Types.ObjectId, ref: 'Basket'},
  pickupEventOverride: {type: Schema.Types.ObjectId, ref: 'PickupEvent', default: null},
  absent: {type: Boolean, default: false},
  done: {type: Boolean, default: false},
  delegate: {type: String, default: null},
  userNote: String,
});

export default mongoose.model('PickupUserEvent', PickupUserEventSchema);
