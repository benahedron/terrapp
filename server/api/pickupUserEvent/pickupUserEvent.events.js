/**
 * PickupUserEvent model events
 */

'use strict';

import {EventEmitter} from 'events';
import PickupUserEvent from './pickupUserEvent.model';
var PickupUserEventEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PickupUserEventEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  PickupUserEvent.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PickupUserEventEvents.emit(event + ':' + doc._id, doc);
    PickupUserEventEvents.emit(event, doc);
  };
}

export default PickupUserEventEvents;
