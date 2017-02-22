'use strict';

var express = require('express');
var controller = require('./membership.controller');

import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/member', auth.isAuthenticated(), controller.indexForMember);
router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.post('/find', auth.hasRole('admin'), controller.find);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.upsert);
router.patch('/:id', auth.hasRole('admin'), controller.patch);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
