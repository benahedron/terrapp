'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.put('/admin/create', auth.hasRole('admin'), controller.createAsAdmin);
router.put('/admin/changePassword/:id', auth.hasRole('admin'), controller.changePasswordAsAdmin);
router.put('/admin/upsert', auth.hasRole('admin'), controller.upsert);
router.post('/', controller.create);

module.exports = router;
