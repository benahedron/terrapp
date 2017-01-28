/**
 * Basket model events
 */

'use strict';

import Basket from '../../api/basket/basket.model';
import Season from '../../api/season/season.model';
import PickupEvent from '../../api/pickupEvent/pickupEvent.model';
import PickupUserEvent from '../../api/pickupUserEvent/pickupUserEvent.model';

import * as Utils from './utils';
import _ from 'lodash';


/**
 * Create all the required pickup event based on a basket.
 * The one possible change is that the defaultPickupOption is changed by the user.
 * This, for obvious reasons can only occure for events in the futur.
 */
export function onUpdateBasket(basket) {
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
              if (Utils.isOldEvent(populatedBasket, userEvent)) {
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

export function onRemoveBasket(basket) {
  PickupUserEvent.remove({basket: basket}).exec();
}
