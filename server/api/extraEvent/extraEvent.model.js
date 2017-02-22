'use strict';

import mongoose, {Schema} from 'mongoose';


var ExtraEventSchema = new mongoose.Schema({
  season: {type: Schema.Types.ObjectId, ref: 'Season'},
  location: {type: Schema.Types.ObjectId, ref: 'PickupOption'},
  title: {type: String, default: null},
  description: {type: String, default: null},
  date: {type: Date, default: null},
  durationMinutes: {type: Number, default: null}
});

export default mongoose.model('ExtraEvent', ExtraEventSchema);
