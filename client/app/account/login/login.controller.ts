'use strict';
// @flow
interface User {
  name: string;
  email: string;
  password: string;
}

export default class LoginController {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {login: undefined};
  submitted = false;
  Auth;
  $state;

  /*@ngInject*/
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then((user) => {
        // Logged in, redirect to home
        if (user.role === 'admin') {
          this.$state.go('adminSeasons');
        } else if (user.role === 'user') {
          this.$state.go('schedule');
        }
      })
      .catch(err => {
        this.errors.login = err.message;
      });
    }
  }
}
