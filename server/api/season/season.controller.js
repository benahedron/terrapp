/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/seasons              ->  index
 * POST    /api/seasons              ->  create
 * GET     /api/seasons/:id          ->  show
 * PUT     /api/seasons/:id          ->  upsert
 * PATCH   /api/seasons/:id          ->  patch
 * DELETE  /api/seasons/:id          ->  destroy
 */

'use strict';


import Season from './season.model';
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

function patchUpdates(patches) {
  return function(entity) {
    try {
      let activePickupOptions = _.cloneDeep(patches.activePickupOptions);
      delete entity.activePickupOptions;
      entity = _.merge(entity, patches);
      entity.markModified('activePickupOptions');
      entity.activePickupOptions = activePickupOptions;
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

// Gets a list of Seasons
export function index(req, res) {
  return Season.find().populate('activePickupOptions').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Season from the DB
export function show(req, res) {
  return Season.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Creates a new Season in the DB
export function create(req, res) {
  return Season.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Season in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Season.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Season in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Season.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Season from the DB
export function destroy(req, res) {
  return Season.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
