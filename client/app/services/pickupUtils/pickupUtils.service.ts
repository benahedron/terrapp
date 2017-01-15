'use strict';
const angular = require('angular');


/*@ngInject*/
export class PickupUtilsService {
  SeasonUtils: Object;
  constructor(SeasonUtils)
  {
    this.SeasonUtils = SeasonUtils;
  }

  public getStartDateFor(season: Object, pickupOption: Object, pickupEvent: Object) {
    let day = this.SeasonUtils.getDateForInterval(season, pickupEvent.eventNumber);
    let offsetInMinutes = pickupOption.weekDay * 24 * 60 + pickupOption.startMinute;
    return new Date(day.getTime() + offsetInMinutes * 60000);
  }

  public getEndDateFor(season: Object, pickupOption: Object, pickupEvent: Object) {
    let day = this.SeasonUtils.getDateForInterval(season, pickupEvent.eventNumber);
    let offsetInMinutes = pickupOption.weekDay * 24 * 60 + pickupOption.startMinute + pickupOption.durationMinutes;
    return new Date(day.getTime() + offsetInMinutes * 60000);
  }

}


export default angular.module('terrappApp.pickupUtils', [])
.service('PickupUtils', PickupUtilsService)
.name;
