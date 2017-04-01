'use strict';

export default function routes($stateProvider) {
    'ngInject';
    $stateProvider
      .state('login', {
        url: '/login',
        template: require('./login/login.html'),
        controller: 'LoginController',
        controllerAs: 'vm',
        parent: 'terrapp'
      })
      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        parent: 'terrapp',
        controller: function($state, Auth) {
          'ngInject';
          var referrer = $state.params.referrer
                        || $state.current.referrer
                        || 'terrapp.main';
          Auth.logout();
          $state.go(referrer);
        }
      })
      .state('signup', {
        url: '/signup',
        template: require('./signup/signup.html'),
        controller: 'SignupController',
        controllerAs: 'vm',
        parent: 'terrapp'
      })
      .state('settings', {
        url: '/settings',
        template: require('./settings/settings.html'),
        controller: 'SettingsController',
        controllerAs: 'vm',
        parent: 'terrapp',
        authenticate: true
      });
}
