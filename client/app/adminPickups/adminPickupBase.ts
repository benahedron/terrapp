'use strict';

export class AdminPickupBase {
  $http: ng.IHttpService;
  PickupUtils: Object;
  PickupOptionsService: Object;

  season: Season;
  pickup: Pickup;
  pickupOptions: Object[];
  userEvents: Object[];

  protected constructor($http, PickupUtils, PickupOptionsService) {
    this.$http = $http;
    this.PickupUtils = PickupUtils;
    this.PickupOptionsService = PickupOptionsService;
  }

  public $onInit() {
    let resolve = (this as any).resolve;
    if (_.has(resolve, 'pickup') && resolve.pickup !== null) {
      this.pickup = resolve.pickup;
      this.season = resolve.season;
      this.load()
    } else {
      this.cancel();
    }
  }

  private load() {
    let scope = this;
    this.$http.get('/api/pickupUserEvents/byEvent/'+this.pickup._id)
    .then(result => {
      scope.userEvents = result.data;
      _.each(scope.userEvents, userEvent => {
        scope.calculateStartTime(userEvent);
      });
      this.$http.get('/api/pickupEvents/alternatives/'+this.pickup._id+'/')
      .then(result => {
        scope.pickupEventAlternatives = result.data;
        _.each(scope.pickupEventAlternatives, alternativePickup => {
          alternativePickup.startDate = scope.PickupUtils.getStartDateFor(scope.season, alternativePickup.pickupOption, alternativePickup);
        })
      });
    });
  }

  protected calculateStartTime(userEvent) {
    if (userEvent.pickupEventOverride) {
      userEvent.pickupEventOverride.startDate = this.PickupUtils.getStartDateFor(this.season, userEvent.pickupEventOverride.pickupOption, userEvent.pickupEventOverride);
    }
    if (userEvent.pickupEvent) {
      userEvent.pickupEvent.startDate = this.PickupUtils.getStartDateFor(this.season, userEvent.pickupEvent.pickupOption, userEvent.pickupEvent);
    }
  }

  public getRequiredBaskets() {
    let requiredBaskets = 0;
    let scope = this;
    _.each(this.userEvents, userEvent => {
      if (((userEvent.pickupEventOverride && userEvent.pickupEventOverride._id === scope.pickup._id) ||
      (!userEvent.pickupEventOverride && userEvent.pickupEvent._id === scope.pickup._id))&&
      !userEvent.absent) {
        requiredBaskets++;
      }
    });
    return requiredBaskets;
  }

  public ok() {;
    (this as any).close({$value: 'ok'});
  }; .

  public cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}
