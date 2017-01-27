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

    _.each(season.activePickupOptions, pickupOption => {
      let n=0;
      let pickupOptionId = pickupOption;
      if (_.has(pickupOptionId, '_id')) {
        pickupOptionId = pickupOptionId._id;
      }
      for(let i = 0; i < season.numberOfEvents; ++i) {
        /// Check if event exsists
        let candidate = _.find(pickupEvents, pickupEvent => {
          let currentId = pickupEvent.pickupOption;
          if (_.has(currentId,'_id'))
            currentId = currentId._id;
          return (currentId.equals(pickupOptionId)) &&
                 (pickupEvent.eventNumber === i);
        });

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

    let idsToRemove = toRemove;//_.map(toRemove, v => {return ObjectId(v)});
    PickupEvent.remove({ '_id': { '$in':idsToRemove}}).then((res, err) => {
      PickupEvent.create(toCreate);
    });
  });
}
