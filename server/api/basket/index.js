'use strict';

var express = require('express');
var controller = require('./basket.controller');
import * as auth from '../../auth/auth.service';
/// Load the basket events to register them properly
import './basket.events';
var router = express.Router();

router.get('/', controller.index);
router.get('/bySeason/:seasonId', controller.indexBySeason);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
