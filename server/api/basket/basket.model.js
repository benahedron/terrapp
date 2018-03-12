'use strict';

import mongoose, {Schema} from 'mongoose';

var BasketSchema = new mongoose.Schema({
  membership: {type: Schema.Types.ObjectId, ref: 'Membership'},
  season: {type: Schema.Types.ObjectId, ref: 'Season'},
  defaultPickupOption: {type: Schema.Types.ObjectId, ref: 'PickupOption'},
  extras: [
    {
      extra: {type: mongoose.Schema.Types.ObjectId, ref: 'ExtraOption'},
      quantity: {type: Number, default: 1}
    }
  ]
});

export default mongoose.model('Basket', BasketSchema);
