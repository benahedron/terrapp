'use strict';

const angular = require('angular');


export class AdminSeasonBasketsComponent{
  season: ISeason;
  $http: ng.IHttpService;

  pickupOptions: IPickupOption[];
  selectedPickupOption: IPickupOption = null;

  searchString: string;
  searchCandidates: Object[];

  members: IMembership[];
  baskets: IBasket[];

  filteredBaskets: Object[];
  filter: string = '';


  /*ngInjector*/
  constructor($http, $scope) {
    this.$http = $http;
  }

  updateSearch() {
    let scope = this;
    if (this.searchString && this.searchString.length>2) {
      this.$http.post("/api/memberships/find", {query: this.searchString})
        .then(res => {
          scope.members = res.data as IMembership[];
        });
    } else {
      scope.members = [];
    }
  }

  updateFilter() {
    let scope = this;
    let filter = scope.filter.toLowerCase();
    this.filteredBaskets = _.filter(this.baskets, basket=> {
      let candidate = (basket.membership.firstName +
                      basket.membership.lastName +
                      basket.membership.firstName).toLowerCase();

      return candidate.indexOf(filter) >= 0;
    });

    this.filteredBaskets = _.sortBy(this.filteredBaskets, (basket) => {
      return basket.membership.firstName +
             basket.membership.lastName;
    });

    this.updateSearch();
  }

  getMemberBaskets(member) {
    return _.filter(this.baskets, basket=> {
      return basket.membership._id == member._id;
    });
  }

  getPickupOption(id) {
    let option = _.find(this.pickupOptions, candidate => {
      return candidate._id === id;
    });
    return option;
  }

  createBasket(membership, pickupOption) {
    let scope = this;
    this.$http.post("/api/baskets", {membership: membership._id, season: scope.season._id, defaultPickupOption: pickupOption._id})
      .then(res => {
        scope.baskets.push(
          {
            _id: (res.data as IBasket)._id,
            membership: membership,
            season: scope.season._id as any,
            defaultPickupOption: pickupOption
          });

          scope.updateFilter();
      });
  }

  deleteBasket(basket) {
    let scope = this;
    this.$http.delete("/api/baskets/"+basket._id)
      .then(res => {
        scope.baskets = _.without(scope.baskets, basket);
        scope.updateFilter();
      });
  }

  hasBasketExtra(basket, extra) {
    let match = _.find(basket.extras, candidate => {
      if (typeof candidate == "string" && extra._id){
        return extra._id == candidate;
      } else {
        return extra._id == candidate._id;
      }
    });
    return (match != null);
  }

  changeExtraToBasket($event, basket, extra) {
    if (this.hasBasketExtra(basket, extra)) {
      basket.extras = _.without(basket.extras, extra);
    } else {
      basket.extras.push(extra);
    }
    this.$http.put("/api/baskets/"+basket._id, basket);
  }

  $onInit() {
    let scope = this;
    let resolve = (this as any).resolve;
    if (_.has(resolve, 'season') && resolve.season !== null) {
      scope.season = resolve.season;
      scope.$http.get("/api/baskets/bySeason/"+this.season._id)
      .then(res => {
        scope.baskets = res.data as IBasket[];
        scope.pickupOptions = scope.season.activePickupOptions;
        scope.updateFilter();
      });
    } else {
      // Season is required!
      this.cancel();
    }
  }

  ok() {
    (this as any).close({$value: 'ok'});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminSeasons')
  .component('adminSeasonBaskets', {
    template: require('./adminSeasonBaskets.html'),
    controller: AdminSeasonBasketsComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
