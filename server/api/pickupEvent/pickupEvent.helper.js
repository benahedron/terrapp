'use strict';

import PickupEvent from './pickupEvent.model';
import _ from 'lodash';

export function updateForSeason(season) {
  let newEvents = [];
  PickupEvent.find({season: season}).exec()
  .then(pickupEvents => {
    let toRemove = [];
    let toCreate = [];
    _.each(pickupEvents, pickupEvent => {
      // Remove PickupEvent if:
      // - PickupOption is no longer active in the current season.
      // - Does no longer match the range of schedlued events
      if ((!_.includes(season.activePickupOptions,  pickupEvent.pickupOption)) ||
        (pickupEvent.eventNumber>=season.numberOfEvents)) {

        toRemove.push(pickupEvent);
      }
    });

    _.each(season.activePickupOptions, pickupOption => {
      for(let i = 0; i < season.numberOfEvents; ++i) {
        /// Check if event exsists
        let candidate = _.find(pickupEvents, pickupEvent => {
          return (pickupEvent.pickupOption._id === pickupOption._id) &&
                 (pickupEvent.eventNumber === i);
        });
        if (!candidate) {
          let newEvent = {
            season: season,
            pickupOption: pickupOption,
            eventNumber: i
          };
          toCreate.push(newEvent);
        }
      }
    });
    PickupEvent.remove({ id: { $in:toRemove}}).then(() => {
      PickupEvent.create(toCreate);
    });
  });
}
