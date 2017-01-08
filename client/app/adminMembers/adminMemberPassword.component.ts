'use strict';

const angular = require('angular');

export class AdminMemberPasswordComponent{
  user: Object;
  password: string = '';
  confirmPassword: string = '';
  errors = {};
  submitted: Boolean = false;
  $http: ng.IHttpService;

  /*ngInjector*/
  constructor($http) {
    this.$http = $http;
  }

  /*ngInjector*/
  $onInit() {
    this.user = (this as any).resolve.user;
  }

  save(form) {
    this.submitted = true;
    if(form.$valid) {
      return this.$http.put('/api/users/admin/changePassword/'+this.user._id, {password: this.password})
      .then((result) => {
        this.ok(result);
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
  }

  ok() {
    (this as any).close({$value: this.user});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };
}


export default angular.module('terrappApp.adminMembers')
  .component('adminMemberPassword', {
    template: require('./adminMemberPassword.html'),
    controller: AdminMemberPasswordComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
