'use strict';

const angular = require('angular');


export class AdminSeasonExtrasComponent{
  season: ISeason;
  $http: ng.IHttpService;

  extras: Object[];

  newName: String = "";
  newNote: String = "";
  newUnit: String = "";

  currentlyEditing = null;

  /*ngInjector*/
  constructor($http, $scope) {
    this.$http = $http;
  }

  canCreateExtra(extra) {
    let value = extra;
    if (!value) {
      value = {
        name: this.newName,
        note: this.newNote
      }
    }
    return value.name != "" && value.note != "";
  }
  createExtra() {
    if (!this.season.hasOwnProperty('availableExtras')) {
      this.season.availableExtras = [];
    }
    this.season.availableExtras.push({
      name: this.newName,
      note: this.newNote,
      unit: this.newUnit
    });
    this.save(() => {
      this.currentlyEditing = null;
      this.reset();
    });
  }

  reset() {
    this.newName = "";
    this.newNote = "";
    this.newUnit = "";
  }

  $onInit() {
    let scope = this;
    let resolve = (this as any).resolve;
    if (_.has(resolve, 'season') && resolve.season !== null) {
      scope.season = resolve.season;
    } else {
      // Season is required!
      this.cancel();
    }
  }

  startEditingExtra(extra) {
    this.currentlyEditing = _.cloneDeep(extra);
  }

  deleteExtra(extra) {
    this.season.availableExtras = _.without(this.season.availableExtras, extra);
    this.save();
  }

  saveEditedExtra(modifiedExtra, extra) {
    extra.name = modifiedExtra.name;
    extra.note = modifiedExtra.note;
    extra.unit = modifiedExtra.unit;
    this.save(() => {
      this.currentlyEditing = null;
    });
  }

  save(cb) {
    this.$http.put('/api/seasons/'+this.season._id, this.season)
    .then((result) => {
      this.season = result.data as ISeason;
      if (cb) {
        cb();
      }
    })
  }

  ok() {
    (this as any).close({$value: this.season});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminSeasons')
  .component('adminSeasonExtras', {
    template: require('./adminSeasonExtras.html'),
    controller: AdminSeasonExtrasComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
