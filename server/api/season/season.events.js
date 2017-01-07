/**
 * Season model events
 */

'use strict';

import {EventEmitter} from 'events';
import Season from './season.model';
import PickupEvent from '../pickupEvent/pickupEvent.model';
import PickupOption from '../pickupOption/pickupOption.model';
import _ from 'lodash';

var SeasonEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SeasonEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Season.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    SeasonEvents.emit(event + ':' + doc._id, doc);
    SeasonEvents.emit(event, doc);
  };
}

function createPickupEventsForOption(season, pickupOption) {
  let newEvents = [];
  for(let i = 0;i < season.numberOfEvents; ++i) {
    let newEvent = {
      season: season,
      pickupOption: pickupOption,
      eventNumber: i
    };
    newEvents.push(newEvent);
  }
  PickupEvent.create(newEvents);
}

function recreateAllPickupEvents(season) {
  if (season.active === false) {
    PickupOption.find().
    then(pickupOptions => {
      PickupEvent.find({season: season._id}).remove()
      .then(() => {
        _.each(pickupOptions, pickupOption => {
          createPickupEventsForOption(season, pickupOption);
        });
      });
    });
  }
}

SeasonEvents.on('save', (season) => {
  recreateAllPickupEvents(season);
})

export default SeasonEvents;
