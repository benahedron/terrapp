'use strict';

var express = require('express');
var controller = require('./pickupUserEvent.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', controller.show);
router.get('/byEvent/:id', auth.hasRole('admin'), controller.indexByPickupEventId);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/donestate/:id/:value', auth.hasRole('admin'), controller.updateDoneState);
router.put('/:id', auth.hasRole('admin'), controller.upsert);
router.patch('/:id', auth.hasRole('admin'), controller.patch);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
