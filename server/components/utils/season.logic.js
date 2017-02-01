'use strict';

import PickupEvent from '../../api/pickupEvent/pickupEvent.model';
import Basket from '../../api/basket/basket.model';
import * as BasketLogic from './basket.logic';
import * as PickupEventLogic from './pickupEvent.logic';
import _ from 'lodash';
import mongoose from 'mongoose';

export function onUpdateSeason(season) {
  let newEvents = [];
  PickupEvent.find({season: season})
  .then(pickupEvents => {
    let toRemove = [];
    let toCreate = [];
    _.each(pickupEvents, pickupEvent => {
      // Remove PickupEvent if:
      // - PickupOption is no longer active in the current season.
      // - Does no longer match the range of schedlued events
      let currentId = pickupEvent.pickupOption;
      if (_.has(currentId,'_id'))
        currentId = currentId._id;

      let candidate = _.find(season.activePickupOptions,  option => {
        return currentId.equals(option);
      });

      if ((!candidate) ||
        (pickupEvent.eventNumber>=season.numberOfEvents)) {
        toRemove.push(pickupEvent._id);
      }
    });

    // Remove all baskets relating to pickup options that are not longer active
    let basketQuery = {'$and': [{ 'season': season}, {'defaultPickupOption': { '$nin': season.activePickupOptions}}]};
    Basket.find(basketQuery).then((baskets, err) => {
      Basket.remove(basketQuery).then((res, err) => {
        _.each(baskets, basket => {
          // Propagate to pickup user events
          BasketLogic.onRemoveBasket(basket);
        });
      });
    });

    // For each of the active options
    _.each(season.activePickupOptions, pickupOption => {
      let n=0;
      let pickupOptionId = pickupOption;
      if (_.has(pickupOptionId, '_id')) {
        pickupOptionId = pickupOptionId._id;
      }
      // For the desired number of events
      for(let i = 0; i < season.numberOfEvents; ++i) {
        // Check if the event with for the option exsists
        let candidate = _.find(pickupEvents, pickupEvent => {
          let currentId = pickupEvent.pickupOption;
          if (_.has(currentId,'_id'))
            currentId = currentId._id;
          return (currentId.equals(pickupOptionId)) &&
                 (pickupEvent.eventNumber === i);
        });

        // If not, create it
        if (!candidate) {
          let newEvent = {
            season: season,
            pickupOption: pickupOptionId,
            eventNumber: i
          };
          toCreate.push(newEvent);
        }
      }
    });

    // Find the ones that must be removed
    PickupEvent.find({ '_id': { '$in':toRemove}}).then((pickupEvents, err) => {
      // Remove them
      PickupEvent.remove({ '_id': { '$in':toRemove}}).then((res, err) => {
        // Cascade in order to remove the user pickup events.
        _.each(pickupEvents, pickupEvent => {
          PickupEventLogic.onRemovePickupEvent(pickupEvent);
        });
        // Finally create the new one
        PickupEvent.create(toCreate).then((newPickupEvents, err) => {
          // Cascade in order to create the user pickup events.
          _.each(newPickupEvents, pickupEvent => {
            PickupEventLogic.onUpdatePickupEvent(pickupEvent);
          });
        });
      });
    });
  });
}


export function onRemoveSeason(season) {
  // Remove all pickup events related to the season (note the basket-cascading will delete the pickup user events)
  PickupEvent.remove({'season':season}).then((res, err) => {
    // Find baskets for the deleted season.
    Basket.find({'season':season}).then((res, err) => {
      // Remove them
      Basket.remove({'season':season}).then(() =>{
        // Cascade to delete the user pickup event data.
        _.each(res, basket => {
          BasketLogic.onRemoveBasket(basket);
        });
      });
    });
  });
}
