'use strict';

import mongoose, {Schema} from 'mongoose';

var PickupUserEventSchema = new mongoose.Schema({
  pickupEvent: {type: Schema.Types.ObjectId, ref: 'PickupEvent'},
  basket: {type: Schema.Types.ObjectId, ref: 'Basket'},
  userPickupOptionOverride: {type: Schema.Types.ObjectId, ref: 'PickupOption', default: null},
  absent: Boolean,
  delegate: {type: String, default: null},
  userNote: String,
});

export default mongoose.model('PickupUserEvent', PickupUserEventSchema);
