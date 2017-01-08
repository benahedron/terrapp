'use strict';

import User from './user.model';
import Membership from '../membership/membership.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').populate('membership').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  if (!_.has(req.body, 'membership')){
    validationError(res);
  } else {
    var newMembership =  Membership(req.body.membership);
    newMembership.save()
      .then(function(membership) {
        var newUser = new User(req.body);
        newUser.provider = 'local';
        newUser.role = 'user';
        newUser.membership = membership;
        newUser.save()
          .then(function(user) {
            var token = jwt.sign({ _id: user._id }, config.secrets.session, {
              expiresIn: 60 * 60 * 5
            });
            res.json({ token });
          })
          .catch(validationError(res));
      })
      .catch(validationError(res));
  }
}

/**
 *
 */
export function createAsAdmin(req, res) {
  var newUser = new User(req.body);

  if (_.has(req.body, 'membership')) {
    var newMembership =  Membership(req.body.membership);
    newMembership.save()
      .then(function(membership) {
        newUser.membership = membership;
        newUser.save()
          .then(function(user) {
            res.json(user);
          })
          .catch(validationError(res));
      })
      .catch(validationError(res));
    } else{
      newUser.save()
        .then(function(user) {
          res.json(user);
        })
        .catch(validationError(res));
    }
}

/**
 * Upsert a user with membership (only allowed as admin, as the "role" can be enforced)
 */
export function upsert(req, res) {
  var newUser =  new User(req.body);
  User.findOneAndUpdate({_id: req.body._id}, newUser)
    .then(function(user) {
      if (_.has(req.body, 'membership')) {
        Membership.findOneAndUpdate({_id: req.body.membership._id}, req.body.membership)
          .then(function(membership) {
            user.membership = membership;
            res.json(user);
          });
      } else {
        res.json(user);
      }
    })
    .catch(validationError(res));
}


/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Change the password of any user as admin.
 */
export function changePasswordAsAdmin(req, res) {
  User.findById(req.params.id).exec()
    .then(user => {
      console.log(req.body);
      user.password = req.body.password;
      return user.save()
        .then(() => {
          res.status(204).end();
        })
        .catch(validationError(res));
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
