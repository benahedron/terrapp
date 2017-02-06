'use strict';

const angular = require('angular');

export class PickupOptionMapWindowComponent{
  pickupOption: IPickupOption;
  bbox: string[];
  mapUrl: string = "http://google.com";
  // Map the zoom levels used in the geoUri to angles.
  zoomToDergee = [360, 180, 90, 45, 22.5, 11.25, 5.625, 2.813, 1.406, 0.703, 0.352, 0.176, 0.088, 0.044, 0.022, 0.011, 0.005, 0.003, 0.001, 0.0005];

  constructor() {
  }

  /*ngInjector*/
  $onInit() {
    this.pickupOption = (this as any).resolve.pickupOption;
    let params = this.pickupOption.geoUri.match(/\d+.\d*/g);
    let dAlpha = this.zoomToDergee[parseInt(params[2])]/2;
    let latitude = parseFloat(params[0]);
    let longitude = parseFloat(params[1]);
    let minLat = latitude-dAlpha;
    let maxLat = latitude+dAlpha;
    let minLong = longitude-dAlpha;
    let maxLong = longitude+dAlpha;

    this.mapUrl = 'http://www.openstreetmap.org/export/embed.html?bbox=' +
    minLong + '%2C'+
    minLat + '%2C'+
    maxLong + '%2C'+
    maxLat + '&amp;layer=mapnik&amp;marker=' +
    latitude + '%2C' +
    longitude;
  }

  ok() {
    (this as any).close({$value: this.pickupOption});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}

export default angular.module('terrappApp.pickupOptionMap')
  .component('pickupOptionMapWindow', {
    template: require('./pickupOptionMapWindow.html'),
    controller: PickupOptionMapWindowComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  })
  .name;
