'use strict';

var express = require('express');
var controller = require('./membership.controller');

import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/find', auth.isAuthenticated(), controller.find);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
