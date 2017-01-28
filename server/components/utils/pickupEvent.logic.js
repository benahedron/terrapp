'use strict';

import PickupUserEvent from '../../api/pickupUserEvent/pickupUserEvent.model';
import Season from '../../api/season/season.model';
import Basket from '../../api/basket/basket.model';
import PickupEvent from '../../api/pickupEvent/pickupEvent.model';
import _ from 'lodash';

/**
 * When a pickup event is updated or saved, assert that the correct user events
 * are present afterwards.
 */
export function onUpdatePickupEvent(pickupEvent) {
  // Look for associated pickup user events
  PickupUserEvent.find({'pickupEvent': pickupEvent}).then((userEvents, err) => {
    // Find the associated season baskets
    Basket.find({'season': pickupEvent.season, 'pickupOption': pickupEvent.pickupOption}).then((baskets, err) => {
      // TODO
    });
  });
}
export function onRemovePickupEvent(pickupEvent) {
  PickupUserEvent.remove({'pickupEvent': pickupEvent}).then((res, err) => {
    PickupUserEvent.remove({'pickupEventOverride': pickupEvent}).exec();
  });
}
