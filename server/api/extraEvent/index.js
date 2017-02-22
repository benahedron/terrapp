'use strict';

var express = require('express');
var controller = require('./extraEvent.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();


router.get('/:seasonId', auth.hasRole('admin'), controller.index);
router.post('/', auth.hasRole('admin'), controller.create);
router.patch('/:id', auth.hasRole('admin'), controller.patch);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
