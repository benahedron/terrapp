'use strict';

var express = require('express');
var controller = require('./season.controller');
import * as auth from '../../auth/auth.service';
/// Load the season events to register them properly
import * as events from './season.events';

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.upsert);
router.patch('/:id', auth.hasRole('admin'), controller.patch);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
