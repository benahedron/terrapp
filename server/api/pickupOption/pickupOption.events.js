/**
 * PickupOption model events
 */

'use strict';

import {EventEmitter} from 'events';
import PickupOption from './pickupOption.model';
import PickupEvent from '../pickupEvent/pickupEvent.model';
import Season from '../season/season.model';
import _ from 'lodash';
var PickupOptionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PickupOptionEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  PickupOption.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PickupOptionEvents.emit(event + ':' + doc._id, doc);
    PickupOptionEvents.emit(event, doc);
  };
}

function assertPickupEvents(pickupOption) {
  Season.find({activeOptions: pickupOption}).exec()
    .then(seasons => {
      _.each(seasons, season => {
        PickupEvent.find({season: season}).remove()
          .then(() => {
              PickupEvent.createPickupEventsForOption(season, pickupOption);
          });
      });
    });
}

PickupOptionEvents.on('remove', pickupOption => {

});

PickupOptionEvents.on('save', pickupOption => {
  assertPickupEvents(pickupOption);
});

export default PickupOptionEvents;
