'use strict';
const angular = require('angular');

export class TranslationService {
  table: Object = {};
  $state: any;
  currentLanguage: string = 'en';

  constructor($state, $rootScope, $stateParams) {
    this.$state = $state;
    this.table['en'] = require('./translation.en').default;
    this.table['fr'] = require('./translation.fr').default;
    let scope = this;
    $rootScope.$on('$stateChangeStart',
      (event, toState, toParams, fromState, fromParams, options) => {
        scope.currentLanguage = toParams.lang||'en';
      });
  }

  translate(key) {
    if (_.has(this.table[this.getCurrentLanguage()], key)) {
      return this.table[this.getCurrentLanguage()][key];
    } else {
      return "Missing key: (" + key + ")";
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getLanguages() {
    return Object.keys(this.table);
  }

  setLanguage(language) {
    if (_.has(this.table,language)) {
      this.$state.go('.',{lang: language});
    }
  }
}

export default angular.module('terrappApp.TranslationService', [])
  .service('TranslationService', TranslationService)
  .name;
