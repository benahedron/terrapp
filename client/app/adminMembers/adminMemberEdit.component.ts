'use strict';

const angular = require('angular');

export class AdminMemberEditComponent{
  user: IUser;
  errors = {};
  isNew: boolean = false;
  submitted: boolean = false;
  $http: ng.IHttpService;
  pickupOptions: IPickupOption[];
  PickupOptionsService: IPickupOptionsService;

  /*ngInjector*/
  constructor($http, PickupOptionsService) {
    this.$http = $http;
    this.PickupOptionsService = PickupOptionsService;
  }

  getPickupOptionName(id) {
    let option = _.find(this.pickupOptions, candidate => {
      return candidate._id === id;
    });
    if (option) {
      return option.name;
    } else {
      return null;
    }
  }

  $onInit() {
    this.PickupOptionsService.get().then((pickupOptions) => {
      this.pickupOptions = pickupOptions;
    });

    let resolve = (this as any).resolve;
    if (_.has(resolve, 'user') && resolve.user !== null) {
      this.user = _.cloneDeep(resolve.user);
      this.isNew = false;
    } else {
      this.user = {} as IUser;
      this.isNew = true;
    }
  }

  save(form) {
    this.submitted = true;
    if(form.$valid) {
      let action = this.isNew ? 'create' : 'upsert';
      return this.$http.put('/api/users/admin/'+action, this.user)
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
