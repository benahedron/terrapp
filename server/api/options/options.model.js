'use strict';

import mongoose from 'mongoose';

var OptionsSchema = new mongoose.Schema({
  name: String,
  value: mongoose.Schema.Types.Mixed
});

export default mongoose.model('Options', OptionsSchema);
