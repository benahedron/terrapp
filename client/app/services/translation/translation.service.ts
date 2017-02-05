'use strict';
const angular = require('angular');

export class TranslationService {
  table: Object = {};
  currentLanguage = 'en';

  constructor() {
    this.table['en'] = require('./translation.en').default;
  }

  translate(key) {
    if (_.has(this.table['en'], key)) {
      return this.table['en'][key];
    } else {
      return "Missing key: (" + key + ")";
    }
  }
}

export default angular.module('terrappApp.TranslationService', [])
  .service('TranslationService', TranslationService)
  .name;
