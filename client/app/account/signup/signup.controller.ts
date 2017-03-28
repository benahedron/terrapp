'use strict';
// @flow
const angular = require('angular');

interface User {
  email: string;
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

export default class SignupController {
  user: User = {
    email: '',
    password: '',
    membership: {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      zip: '',
      country: '',
      defaultPickupOption: null
    }
  };
  errors = {};
  submitted = false;
  Auth;
  $state;
  activePickupOptions :any;

  /*@ngInject*/
  constructor(Auth, $state, $http) {
    this.Auth = Auth;
    this.$state = $state;

    let scope = this;
    $http.get('/api/pickupOptions/current')
    .then( (res) => {
      scope.activePickupOptions = res.data;
    });
  }

  register(form) {
    this.submitted = true;

    if(form.$valid) {
      return this.Auth.createUser({
        email: this.user.email,
        password: this.user.password,
        membership: {
          firstName: this.user.membership.firstName,
          lastName: this.user.membership.lastName,
          address1: this.user.membership.address1,
          address2: this.user.membership.address2,
          city: this.user.membership.city,
          zip: this.user.membership.zip,
          country: this.user.membership.country,
          defaultPickupOption: this.user.membership.defaultPickupOption._id
        }
      })
      .then(() => {
        // Account created, redirect to home
                this.$state.go('main');      })
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
}
