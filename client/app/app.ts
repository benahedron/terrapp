'use strict';

const angular = require('angular');
// import ngAnimate from 'angular-animate';
const ngCookies = require('angular-cookies');
const ngResource = require('angular-resource');
const ngSanitize = require('angular-sanitize');
const fileUpload = require('ng-file-upload');


const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');
// const ngMessages = require('angular-messages');
// import ngValidationMatch from 'angular-validation-match';


require('./interfaces');

import {routeConfig} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import adminMembers from './adminMembers/adminMembers.component';
import adminMemberDelete from './adminMembers/adminMemberDelete.component';
import adminMemberEdit from './adminMembers/adminMemberEdit.component';
import adminMemberPassword from './adminMembers/adminMemberPassword.component';
import adminPickupOptions from './adminPickupOptions/adminPickupOptions.component';
import adminPickupOptionDelete from './adminPickupOptions/adminPickupOptionDelete.component';
import adminPickupOptionEdit from './adminPickupOptions/adminPickupOptionEdit.component';
import adminPickups from './adminPickups/adminPickups.component';
import adminPickupEdit from './adminPickups/adminPickupEdit.component';
import adminPickupManage from './adminPickups/adminPickupManage.component';
import adminPickupMail from './adminPickups/adminPickupMail.component';
import adminPickupPrint from './adminPickups/adminPickupPrint.component';
import adminSeasons from './adminSeasons/adminSeasons.component';
import adminSeasonDelete from './adminSeasons/adminSeasonDelete.component';
import adminSeasonEdit from './adminSeasons/adminSeasonEdit.component';
import adminSeasonBaskets from './adminSeasons/adminSeasonBaskets.component';
import adminSeasonExtras from './adminSeasons/adminSeasonExtras.component';
import adminExtraEvent from './adminExtraEvents/adminExtraEvents.component';
import adminExtraEventDelete from './adminExtraEvents/adminExtraEventDelete.component';
import adminExtraEventEdit from './adminExtraEvents/adminExtraEventEdit.component';
import adminBackup from './adminBackup/adminBackup.component';
import adminBackupRestore from './adminBackup/adminBackupRestore.component';
import schedule from './schedule/schedule.component';
import userPickupEdit from './schedule/userPickupEdit.component';
import changePickupOption from './schedule/changePickupOption.component';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';

import optionsService from './services/optionsService/optionsService.service';
import pickupOptionsService from './services/pickupOptionsService/pickupOptionsService.service';
import seasonUtilsService from './services/seasonUtils/seasonUtils.service';
import pickupUtilsService from './services/pickupUtils/pickupUtils.service';
import translationService from './services/translation/translation.service';
import translationFilter from './filters/translation/translation.filter';
import trustedFilter from './filters/trusted/trusted.filter';
import geouriFilter from './filters/geouri/geouri.filter';

import pickupOptionMapDirective from './directives/pickupOptionMap/pickupOptionMap.directive';
import pickupOptionMapWindowComponent from './directives/pickupOptionMap/pickupOptionMapWindow.component';

import './app.less';

angular.module('terrappApp', [
  ngCookies,
  ngResource,
  ngSanitize,
  fileUpload,

  uiRouter,
  uiBootstrap,

  optionsService,
  pickupOptionsService,
  pickupUtilsService,
  seasonUtilsService,
  translationService,

  translationFilter,
  trustedFilter,
  geouriFilter,

  pickupOptionMapDirective,
  pickupOptionMapWindowComponent,

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
  adminSeasonExtras,
  adminPickups,
  adminPickupEdit,
  adminPickupManage,
  adminPickupMail,
  adminPickupPrint,
  adminPickupOptions,
  adminPickupOptionDelete,
  adminPickupOptionEdit,
  adminExtraEvent,
  adminExtraEventDelete,
  adminExtraEventEdit,
  adminBackup,
  adminBackupRestore,
  schedule,
  userPickupEdit,
  changePickupOption,
  navbar,
  footer,
  main,
  constants,

  util
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth, $stateParams, $state) {
    'ngInject';

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/'+next.params.lang+'/login');
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
