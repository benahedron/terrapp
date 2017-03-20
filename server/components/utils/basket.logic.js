/**
 * Basket model events
 */

'use strict';

import Basket from '../../api/basket/basket.model';
import Season from '../../api/season/season.model';
import PickupEvent from '../../api/pickupEvent/pickupEvent.model';
import PickupOption from '../../api/pickupOption/pickupOption.model';
import PickupUserEvent from '../../api/pickupUserEvent/pickupUserEvent.model';

import * as Utils from './utils';
import _ from 'lodash';


/**
 * Create all the required pickup event based on a basket.
 * The one possible change is that the defaultPickupOption is changed by the user.
 * This, for obvious reasons can only occure for events in the futur.
 */
export function onUpdateBasket(basket) {
  basket.populate('season').populate('defaultPickupOption').execPopulate()
  .then( populatedBasket => {

    PickupUserEvent.find({basket: populatedBasket._id})
    .populate({path: 'basket', populate: { path: 'season' }})
    .populate({path: 'pickupEvent', populate: { path: 'pickupOption' }})
    .populate({path: 'pickupEventOverride', populate: { path: 'pickupOption' }})
    .exec()
    .then((existingUserEvents) => {
      PickupEvent.find({season: populatedBasket.season, pickupOption: populatedBasket.defaultPickupOption}).exec()
      .then( pickupEvents => {
        let newUserEvents = [];
        // For each of the required events:
        _.each(pickupEvents, pickupEvent => {
          // Is there an old user event already?
          let existingUserEvent = _.find(existingUserEvents, candidate => {
            return candidate.pickupEvent.eventNumber === pickupEvent.eventNumber;
          });

          // Create the new version
          let newUserEvent =  {
            pickupEvent: pickupEvent,
            basket: populatedBasket,
            userNote: ''
          };

          // If there is an old one
          if (existingUserEvent) {

            // If it is a past or non editable event
            console.log( Utils.isOldUserEvent(existingUserEvent),  Utils.isEditableUserEvent(existingUserEvent) );
            if (Utils.isOldUserEvent(existingUserEvent) ||
                !Utils.isEditableUserEvent(existingUserEvent)) {
              // do not touch it
              //console.log(existingUserEvents.length, existingUserEvent.length);
              existingUserEvents = _.without(existingUserEvents, existingUserEvent);
              //onsole.log(existingUserEvents.length);
            } else {
              // migrate to a new user event (will delete the old one)
              newUserEvent.userNote = existingUserEvent.userNote;
              newUserEvent.absent = existingUserEvent.absent;
              newUserEvent.pickupEventOverride = existingUserEvent.pickupEventOverride;
              newUserEvent.delegate = existingUserEvent.delegate;
              newUserEvents.push(newUserEvent);
            }
          } else {
            newUserEvents.push(newUserEvent);
          }
        });

        // Finally remove existing ones and create the new ones
        PickupUserEvent.remove({ _id: { $in: existingUserEvents}}).then(() => {
          PickupUserEvent.create(newUserEvents);
        });
      });
    });
  });
}

export function onRemoveBasket(basket) {
  PickupUserEvent.remove({basket: basket}).exec();
}

/**
 * Update all FUTUR user events to match the new defaultPickupOption.
 */
export function onUpdateDefaultPickupOption(basket, defaultPickupOption, callback) {
  basket.defaultPickupOption = defaultPickupOption;
  basket.save()
  .then(savedBasket => {
    if(callback) {
      onUpdateBasket(savedBasket);
      callback(savedBasket);
    }
  });
}
