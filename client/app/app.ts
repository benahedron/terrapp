'use strict';
const angular = require('angular');
// import ngAnimate from 'angular-animate';
const ngCookies = require('angular-cookies');
const ngResource = require('angular-resource');
const ngSanitize = require('angular-sanitize');


const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');
// const ngMessages = require('angular-messages');
// import ngValidationMatch from 'angular-validation-match';


import {routeConfig} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import adminMembers from './adminMembers/adminMembers.component';
import adminMemberDelete from './adminMembers/adminMemberDelete.component';
import adminMemberEdit from './adminMembers/adminMemberEdit.component';
import adminMemberPassword from './adminMembers/adminMemberPassword.component';
import adminPickupOptions from './adminPickupOptions/adminPickupOptions.component';
import adminPickupOptionDelete from './adminPickupOptions/adminPickupOptionDelete.component';
import adminPickups from './adminPickups/adminPickups.component';
import adminSeasons from './adminSeasons/adminSeasons.component';
import adminSeasonDelete from './adminSeasons/adminSeasonDelete.component';
import adminSeasonEdit from './adminSeasons/adminSeasonEdit.component';
import adminSeasonBaskets from './adminSeasons/adminSeasonBaskets.component';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';

import optionsService from './services/optionsService/optionsService.service';
import pickupOptionsService from './services/pickupOptionsService/pickupOptionsService.service';
import seasonUtilsService from './services/seasonUtils/seasonUtils.service';
import pickupUtilsService from './services/pickupUtils/pickupUtils.service';


import './app.less';

angular.module('terrappApp', [
  ngCookies,
  ngResource,
  ngSanitize,

  uiRouter,
  uiBootstrap,

  optionsService,
  pickupOptionsService,
  pickupUtilsService,
  seasonUtilsService,

  _Auth,
  account,
  adminMembers,
  adminMemberDelete,
  adminMemberEdit,
  adminMemberPassword,
  adminSeasons,
  adminSeasonDelete,
  adminSeasonEdit,
  adminSeasonBaskets,
  adminPickups,
  adminPickupOptions,
  adminPickupOptionDelete,
  navbar,
  footer,
  main,
  constants,

  util
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['terrappApp'], {
      strictDi: true
    });
  });
