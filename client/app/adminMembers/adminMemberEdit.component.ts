'use strict';

const angular = require('angular');

interface User {
  email: string;
  role: string;
  password: string;
  membership: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    zip: string;
    country: string;
  }
}

export class AdminMemberEditComponent{
  user: User;
  errors = {};
  isNew: Boolean = false;
  submitted: Boolean = false;
  $http: ng.IHttpService;

  /*ngInjector*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    let resolve = (this as any).resolve;
    if (_.has(resolve, 'user') && resolve.user !== null) {
      this.user = _.cloneDeep(resolve.user);
      this.isNew = false;
    } else {
      this.user = {};
      this.isNew = true;
    }
  }

  save(form) {
    this.submitted = true;
    if(form.$valid) {
      let action = this.isNew ? 'create' : 'upsert';
      return this.$http.put('/api/users/admin/'+action, this.user)
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
    (this as any).resolve.user = this.user;
    (this as any).close({$value: this.user});
  };

  cancel() {
    (this as any).dismiss({$value: 'cancel'});
  };

  toggleRole() {
    if (this.isAdmin()) {
      this.user.role = 'user';
    } else {
      this.user.role = 'admin';
    }
  }

  isAdmin() {
    return this.user.role === 'admin';
  }
}


export default angular.module('terrappApp.adminMembers')
  .component('adminMemberEdit', {
    template: require('./adminMemberEdit.html'),
    controller: AdminMemberEditComponent,
    controllerAs: '$ctrl',
    bindings: {
      resolve: '<',
      close: '&',
      dismiss: '&'
    },
  }).name;
