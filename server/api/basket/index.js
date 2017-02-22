'use strict';

var express = require('express');
var controller = require('./basket.controller');
import * as auth from '../../auth/auth.service';
/// Load the basket events to register them properly
import './basket.events';
var router = express.Router();

router.put('/user', auth.isAuthenticated(), controller.updateBasket);
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/bySeason/:seasonId', auth.hasRole('admin'), controller.indexBySeason);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.upsert);
router.patch('/:id', auth.hasRole('admin'), controller.patch);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
