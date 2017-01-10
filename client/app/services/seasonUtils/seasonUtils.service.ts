'use strict';
const angular = require('angular');


/*@ngInject*/
export class SeasonUtilsService {

  public getDateForInterval(season: Object, number: number) {
    let start = new Date(season.firstEventDate);
    return new Date(start.getTime() + 24*60*60*1000*number*season.eventIntervalInDays);
  }

}

function SeasonResource($resource) {
  'ngInject';
  return $resource('/api/seasons/', {}, {});
}


export default angular.module('terrappApp.seasonUtils', [])
  .factory('Season', SeasonResource)
  .service('SeasonUtils', SeasonUtilsService)
  .name;
