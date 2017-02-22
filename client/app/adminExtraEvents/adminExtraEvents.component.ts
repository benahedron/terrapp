'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './adminExtraEvents.routes';
import {ModalBase} from '../shared/modal.base';

export class AdminExtraEventsComponent extends ModalBase{
  extraEvents: Object[];
  $http: ng.IHttpService;
  OptionsService: IOptionsService;
  $state: ng.ui.IStateService;

  /*@ngInject*/
  constructor($http, OptionsService, $uibModal) {
    super($uibModal);
    this.$http = $http;
    this.OptionsService = OptionsService;
    this.reload();
  }

  getResolve(extraEvent) {
    let scope = this;
    return {
      extraEvent: function () {
        return extraEvent;
      },
      season: function() {
        return scope.activeSeason;
      }
    }
  }

  private reload() {
    this.OptionsService.getActiveSeason()
    .then((activeSeason) => {
      this.activeSeason = activeSeason;
      this.$http.get("/api/extraEvents/"+activeSeason)
      .then((res) => {
        this.extraEvents = res.data as IExtraEvent[];
      });
    })
  }

  delete(extraEvent) {
    let scope = this;
    this.modal('adminExtraEventDelete', this.getResolve(extraEvent), (extraEvent) => {
      scope.extraEvents.splice(scope.extraEvents.indexOf(extraEvent), 1);
    });
  }

  edit(extraEvent) {
    this.modal('adminExtraEventEdit', this.getResolve(extraEvent), (editedExtraEvent) => {
      _.assign(extraEvent, editedExtraEvent);
    });
  }

  create() {
    let scope = this;
    this.modal('adminExtraEventEdit', this.getResolve(null), (extraEvent) => {
      scope.extraEvents.push(extraEvent);
    });
  }

}

export default angular.module('terrappApp.adminExtraEvents', [uiRouter])
  .config(routes)
  .component('adminExtraEvents', {
    template: require('./adminExtraEvents.html'),
    controller: AdminExtraEventsComponent,
    controllerAs: '$ctrl'
  })
  .name;
