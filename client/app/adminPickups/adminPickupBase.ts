'use strict';

export class AdminPickupBase {
  protected $http: ng.IHttpService;
  PickupUtils: IPickupUtilsService;
  PickupOptionsService: IPickupOptionsService;

  season: ISeason;
  pickup: IPickupEvent;
  pickupOptions: IPickupOption[];
  userEvents: IPickupUserEvent[];
  pickupEventAlternatives: IPickupEvent[];
  extraInformation: {};

  constructor($http, PickupUtils, PickupOptionsService) {
    this.$http = $http;
    this.PickupUtils = PickupUtils;
    this.PickupOptionsService = PickupOptionsService;
  }

  public $onInit() {
    let resolve = (this as any).resolve;
    if (_.has(resolve, 'pickup') && resolve.pickup !== null) {
      this.pickup = resolve.pickup;
      this.season = resolve.season;
      this.load();
    } else {
      this.cancel();
    }
  }

  private load() {
    let scope = this;
    this.$http.get('/api/pickupUserEvents/byEvent/'+this.pickup._id)
    .then(result => {
      scope.userEvents = result.data as IPickupUserEvent[];
      scope.userEvents = _.filter(scope.userEvents, userEvent => {
        return userEvent.basket !== null;
      });
      _.each(scope.userEvents, userEvent => {
        scope.getExtras(userEvent)
        scope.calculateStartTime(userEvent);
      });
      scope.userEvents = _.sortBy(scope.userEvents, userEvent => {
        return userEvent.basket.membership.lastName + userEvent.basket.membership.firstName;
      });

      this.extraInformation = this.getExtraInformation();

      this.$http.get('/api/pickupEvents/alternatives/'+this.pickup._id+'/')
      .then(result => {

        scope.pickupEventAlternatives = result.data as IPickupEvent[];
        _.each(scope.pickupEventAlternatives, alternativePickup => {
          alternativePickup.startDate = scope.PickupUtils.getStartDateFor(scope.season, alternativePickup.pickupOption, alternativePickup);
        });
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

  public hasExtraInformation() {
    return this.pickup.availableExtras.length>0;
  }

  public getExtraInformation() {
    let extraInfo = {};
    let scope = this;

    
    _.each(scope.pickup.availableExtras, extra => {
      let fullExtra = _.find(scope.season.availableExtras, candidate => {
        return (candidate._id == extra);
      });
      if (fullExtra) {
        extraInfo[fullExtra._id] = {
          'count': 0,
          'name': fullExtra.name,
          'unit': fullExtra.unit
        };
      }
    });
    
    _.each(scope.userEvents, userEvent => {
      
      if (((userEvent.pickupEventOverride && userEvent.pickupEventOverride._id === scope.pickup._id) ||
      (!userEvent.pickupEventOverride && userEvent.pickupEvent._id === scope.pickup._id))&&
      !userEvent.absent) {
        _.each(userEvent.basket.extras, extra => {
          if (_.has(extraInfo, extra.extra)) {
            extraInfo[extra.extra]['count'] += extra.quantity; 
          }
        });
      }
    });
    return extraInfo;
  }



  getExtras(userEvent) {
    let pickupExtras = _.filter(this.season.availableExtras, candidate => {
      return _.find(this.pickup.availableExtras, (child) => {
        return candidate._id == child;
      }) != null;
    });
    let result = [];
    _.each(pickupExtras, candidate => {
      _.each(userEvent.basket.extras, (child) => {
        if (candidate._id == child.extra) {
          result.push(
            {
              'quantity': child.quantity,
              'unit': candidate.unit,
              'name': candidate.name
            });
        }
      }) != null;
    });
    userEvent.$extras = result;
  }

  hasExtras(userEvent) {
    return this.getExtras(userEvent).length != 0;
  }

  public ok() {;
    (this as any).close({$value: 'ok'});
  };

  public cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}
