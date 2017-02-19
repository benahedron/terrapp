'use strict';

const angular = require('angular');

export class ChangePickupOptionComponent {
  PickupUtils: IPickupUtilsService;
  PickupOptionsService: IPickupOptionsService;
  $http: ng.IHttpService;
  pickupOptions: IPickupOption[];
  baskets: IBasket[];
  season: ISeason;

  /*ngInjector*/
  constructor($http, PickupUtils: IPickupUtilsService, PickupOptionsService: IPickupOptionsService) {
    this.$http = $http;
    this.PickupUtils = PickupUtils;
    this.PickupOptionsService = PickupOptionsService;
  }

  $onInit() {
    let scope = this;
    this.PickupOptionsService.get()
    .then(pickupOptions => {
      scope.pickupOptions = pickupOptions
      // Get the member's baskets
      let resolve = (scope as any).resolve;
      if (_.has(resolve, 'baskets') && resolve.baskets !== null) {
        scope.baskets = resolve.baskets as IBasket[];
      }
      if (_.has(resolve, 'season') && resolve.season !== null) {
        scope.season = resolve.season as ISeason;
      }
    });
  }

  getPickupOption(optionId) {
    return _.find(this.pickupOptions, candidate => {
     return candidate._id+'' === optionId+'';
   });
  }

  getActivePickupOptions() {
    let scope = this;
    return _.map(this.season.activePickupOptions, optionId => {
      return scope.getPickupOption(optionId);
    });
  }

  getPickupOptionName(basket) {
    return this.getPickupOption(basket.defaultPickupOption).name;
  }

  save(form) {
    let defaultBaskets = _.map(this.baskets, basket => {
      return {_id: basket._id, defaultPickupOption: basket.defaultPickupOption};
    });
    this.$http.put('/api/baskets/user/',defaultBaskets)
    .then((result) => {
      this.ok();
    }));
  };

  ok() {
    (this as any).close({$value: 'ok'});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.schedule')
.component('changePickupOption', {
  template: require('./changePickupOption.html'),
  controller: ChangePickupOptionComponent,
  controllerAs: '$ctrl',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
}).name;
