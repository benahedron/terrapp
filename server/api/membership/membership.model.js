'use strict';

import mongoose from 'mongoose';

var MembershipSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  enabled: Boolean,
  address1: String,
  address2: String,
  city: String,
  country: String,
  zip: String,
});

export default mongoose.model('Membership', MembershipSchema);
