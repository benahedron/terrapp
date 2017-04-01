/**
 * Basket model events
 */

'use strict';

import User from '../../api/user/user.model';
import Basket from '../../api/basket/basket.model';
import Membership from '../../api/membership/membership.model';
import * as BasketLogic from './basket.logic';

import _ from 'lodash';



export function onRemoveUser(user) {
  if (user.membership) {
    Membership.findByIdAndRemove(user.membership).exec()
    .then(() => {
      Basket.find({membership: user.membership}).exec()
      .then((baskets) => {
        _.each(baskets, basket => {
          basket.remove()
          .then(() => {
            BasketLogic.onRemoveBasket(basket);
          });
        });
      });
    });
  }
}
