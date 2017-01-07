/**
 * Membership model events
 */

'use strict';

import {EventEmitter} from 'events';
import Membership from './membership.model';
var MembershipEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MembershipEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Membership.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MembershipEvents.emit(event + ':' + doc._id, doc);
    MembershipEvents.emit(event, doc);
  };
}

export default MembershipEvents;
