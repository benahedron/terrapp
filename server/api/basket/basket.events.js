/**
 * Basket model events
 */

'use strict';

import {EventEmitter} from 'events';
import Basket from './basket.model';
import Season from '../season/season.model';
import PickupEvent from '../pickupEvent/pickupEvent.model';
import PickupUserEvent from '../pickupUserEvent/pickupUserEvent.model';
import * as Utils from '../../components/utils/utils';
import _ from 'lodash';
var BasketEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BasketEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Basket.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    BasketEvents.emit(event + ':' + doc._id, doc);
    BasketEvents.emit(event, doc);
  };
}

/**
 * Check is a user event is already done
 */
function isOldEvent(season, userEvent) {
  var actualEvent = userEvent.pickupEventOverride || userEvent.pickupEvent;
  let now = new Date().getTime();
  console.log(actualEvent.pickupOption);
  let eventDate = Utils.getStartDateForPickupEvent(season, actualEvent.pickupOption, actualEvent);
  return now >= eventDate.geTime();
}

/**
 * Create all the required pickup event based on a basket.
 * The one possible change is that the defaultPickupOption is changed by the user.
 * This, for obvious reasons can only occure for events in the futur.
 */
function recreateAllPickupEvents(basket) {
  basket.execPopulate('season defaultPickupOption')
    .then( populatedBasket => {
      PickupUserEvent.find({basket: populatedBasket._id}).populate('pickupEvent').exec()
      .then((existingUserEvents) => {
        PickupEvent.find({season: populatedBasket.season, pickupOption: populatedBasket.defaultPickupOption}).exec()
        .then( pickupEvents => {
          let newUserEvents = [];
          // For each of the required events:
          _.each(pickupEvents, pickupEvent => {
            // Is there an old user event already?
            let candiateExitingEvent = _.find(existingUserEvents, candidate => {
              return candidate.pickupEvent.eventNumber === pickupEvent.eventNumber;
            });

            // Create the new version
            let newUserEvent =  {
              pickupEvent: pickupEvent._id,
              basket: populatedBasket._id,
              userNote: ''
            };

            // If there is an old one
            if (candiateExitingEvent) {
              // If it is a past event
              if (isOldEvent(populatedBasket, userEvent)) {
                // do not touch it
                existingUserEvents = _.without(existingUserEvents, candiateExitingEvent);
              } else {
                // migrate to a new user event (will delete the old one)
                newUserEvent.userNote = candiateExitingEvent.userNote;
                newUserEvent.absent = candiateExitingEvent.absent;
                newUserEvent.userNpickupEventOverrideote = candiateExitingEvent.pickupEventOverride;
                newUserEvent.delegate = candiateExitingEvent.delegate;
                newUserEvents.push(newUserEvent);
              }
            } else {
              newUserEvents.push(newUserEvent);
            }
          });

          // Finally remove existing ones and create the new ones
          PickupUserEvent.remove({ id: { $in: existingUserEvents}}).then(() => {
            PickupUserEvent.create(newUserEvents);
          });
        });
      });
    });
}

BasketEvents.on('save', basket => {
  recreateAllPickupEvents(basket);
});

export default BasketEvents;
