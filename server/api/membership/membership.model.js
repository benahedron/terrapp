'use strict';

import mongoose, {Schema} from 'mongoose';

var MembershipSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  enabled: Boolean,
  address1: String,
  address2: String,
  city: String,
  country: String,
  zip: String,
  defaultPickupOption: {type: Schema.Types.ObjectId, ref: 'PickupOption'}
});

export default mongoose.model('Membership', MembershipSchema);
