'use strict';

var express = require('express');
var controller = require('./options.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.get('/:name', auth.hasRole('admin'), controller.load);
router.post('/:name', auth.hasRole('admin'), controller.save);

module.exports = router;
