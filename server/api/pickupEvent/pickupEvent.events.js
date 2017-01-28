/**
 * PickupEvent model events
 */

'use strict';

import {EventEmitter} from 'events';
import PickupEvent from './pickupEvent.model';
import * as PickupEventLogic from '../../components/utils/pickupEvent.logic';
var PickupEventEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PickupEventEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  PickupEvent.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PickupEventEvents.emit(event + ':' + doc._id, doc);
    PickupEventEvents.emit(event, doc);
  };
}


export default PickupEventEvents;
