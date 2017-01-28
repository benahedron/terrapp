/**
 * Basket model events
 */

'use strict';

import PickupOption from '../../api/pickupOption/pickupOption.model';
import * as SeasonLogic from './season.logic';
import Season from '../../api/season/season.model';

import * as Utils from './utils';
import _ from 'lodash';


export function onUpdatePickupOption(pickupOption) {
  Season.find({activeOptions: pickupOption}).exec()
    .then(seasons => {
      _.each(seasons, season => {
        SeasonLogic.onUpdateSeason(season);
      });
    });
}

export function onRemovePickupOption(pickupOption) {

}
