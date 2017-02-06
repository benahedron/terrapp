'use strict';

const angular = require('angular');

export class UserPickupEditComponent {
  userEvent: IPickupUserEvent;
  PickupUtils: IPickupUtilsService;
  PickupOptionsService: IPickupOptionsService;
  errors = {};
  submitted: Boolean = false;
  $http: ng.IHttpService;
  pickupOptions: IPickupOption[];
  pickupEventAlternatives: IPickupEvent[];

  /*ngInjector*/
  constructor($http, PickupUtils: IPickupUtilsService, PickupOptionsService: IPickupOptionsService) {
    this.$http = $http;
    this.PickupUtils = PickupUtils;
    this.PickupOptionsService = PickupOptionsService;
  }

  $onInit() {
    let scope = this;
    let resolve = (this as any).resolve;
    // Get the userEvent as an argument
    if (_.has(resolve, 'userEvent') && resolve.userEvent !== null) {
      this.userEvent = _.cloneDeep(resolve.userEvent as IPickupUserEvent);
      this.$http.get('/api/pickupEvents/alternatives/'+this.userEvent.pickupEvent._id+'/')
      .then(result => {
        scope.pickupEventAlternatives = result.data as IPickupEvent[];
        _.each(scope.pickupEventAlternatives, alternativePickup => {
          alternativePickup.startDate = scope.PickupUtils.getStartDateFor(resolve.season, alternativePickup.pickupOption, alternativePickup);
        })
      });
      scope.reinit();
    } else {
      this.cancel();
    }
  }

  private reinit() {
    this.update();
  }

  update() {

  }

  getAlternatives() {
    return this.pickupEventAlternatives;
  }

  save(form) {
    this.submitted = true;
    if(form.$valid) {
      this.$http.put('/api/pickupUserEvents/user/'+this.userEvent._id,this.userEvent)
      .then((result) => {
        this.ok();
      })
      .catch(err => {
        err = err.data;
        this.errors = {};
        // Update validity of form fields that match the mongoose errors
        angular.forEach(err.errors, (error, field) => {
          form[field].$setValidity('mongoose', false);
          this.errors[field] = error.message;
        });

      });
    }
  };

  setPickupOverride(userEvent, original, override) {
    if (original._id === override._id) {
      userEvent.pickupEventOverride = null;
    } else {
      userEvent.pickupEventOverride = override;
    }
  }

  ok() {
    (this as any).resolve.userEvent = this.userEvent;
    (this as any).close({$value: this.userEvent});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.schedule')
  .component('userPickupEdit', {
    template: require('./userPickupEdit.html'),
    controller: UserPickupEditComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
