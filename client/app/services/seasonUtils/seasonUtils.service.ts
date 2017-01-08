'use strict';
const angular = require('angular');

/*@ngInject*/
export class SeasonUtilsService {

  public getDateForInterval(season: Object, number: number) {
    let start = new Date(season.firstEventDate);
    return new Date(start.getTime() + 24*60*60*1000*number*season.eventIntervalInDays);
  }

}

export default angular.module('terrappApp.seasonUtils', [])
  .service('SeasonUtils', SeasonUtilsService)
  .name;
