/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/memberships              ->  index
 * POST    /api/memberships              ->  create
 * GET     /api/memberships/:id          ->  show
 * PUT     /api/memberships/:id          ->  upsert
 * PATCH   /api/memberships/:id          ->  patch
 * DELETE  /api/memberships/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Membership from './membership.model';
import Basket from '../basket/basket.model';
import Options from '../options/options.model';
import PickupUserEvent from '../pickupUserEvent/pickupUserEvent.model';
import ExtraEvent from '../extraEvent/extraEvent.model';
import * as Utils from '../../components/utils/utils';
import _ from 'lodash';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function filterQuery(query) {
  let simpleQuery = query.toLowerCase();
  return function(entities) {
    if(entities) {
      let filtered = _.filter(entities, membership => {
        let candidate = membership.firstName.toLowerCase() +
                        membership.lastName.toLowerCase() +
                        membership.firstName.toLowerCase();
        return candidate.indexOf(simpleQuery) >= 0;
      });
      return filtered;
    } else {
      return null;
    }
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Memberships
export function index(req, res) {
  return Membership.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Find members
export function find(req, res) {
  return Membership.find()
    .populate('defaultPickupOption.name')
    .exec()
    .then(filterQuery(req.body.query, res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Membership from the DB
export function show(req, res) {
  return Membership.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Membership in the DB
export function create(req, res) {
  return Membership.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Membership in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Membership.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Membership in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Membership.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Membership from the DB
export function destroy(req, res) {
  return Membership.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


// Index the complete data relevant for a user
export function indexForMember(req, res) {
  return Options.findOne({name: 'activeSeason'})
  .then(seasonId => {
    if ((!seasonId.value) || seasonId.value === '') {
      return res.status(200).send({baskets: [], pickupUserEvents: [], extraEvents: []});
    }
    else {
      return ExtraEvent.find({season: seasonId.value})
      .populate('location')
      .then(extraEvents => {
        return Basket.find({season: seasonId.value, membership: req.user.membership})
        .populate('season')
        .then(baskets => {
          let basketIds = _.map(baskets, '_id');
          return PickupUserEvent.find({basket: {'$in': basketIds}})
          .populate({path: 'basket', populate: { path: 'season' }})
          .populate({path: 'pickupEvent', select: '-mails', populate: [{ path: 'pickupOption' }, { path: 'pickupOptionOverride' }]})
          .populate({path: 'pickupEventOverride', select: '-mails', populate: [{ path: 'pickupOption' }, { path: 'pickupOptionOverride' }]})
          .then(pickupUserEvents => {
            let result = [];
            _.each(pickupUserEvents, pickupUserEvent => {
              let userEvent = pickupUserEvent.toObject();
              let old = Utils.isOldUserEvent(pickupUserEvent);
              let editable = Utils.isEditableUserEvent(pickupUserEvent);
              delete userEvent.basket.season;
              userEvent.old = old;
              userEvent.editable = editable;
              result.push(userEvent);
            });
            res.status(200).send({baskets: baskets, pickupUserEvents: result, extraEvents: extraEvents});
          });
        })
        .catch(handleError(res));
      })
      .catch(handleError(res));
    }
  })
}
