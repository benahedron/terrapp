/**
 * Options model events
 */

'use strict';

import {EventEmitter} from 'events';
import Options from './options.model';
var OptionsEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OptionsEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Options.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    OptionsEvents.emit(event + ':' + doc._id, doc);
    OptionsEvents.emit(event, doc);
  };
}

export default OptionsEvents;
