/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/pickupOptions              ->  index
 * POST    /api/pickupOptions              ->  create
 * GET     /api/pickupOptions/:id          ->  show
 * PUT     /api/pickupOptions/:id          ->  upsert
 * PATCH   /api/pickupOptions/:id          ->  patch
 * DELETE  /api/pickupOptions/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import PickupOption from './pickupOption.model';

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
      entity = _.merge(entity, patches);
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

// Gets a list of PickupOptions
export function index(req, res) {
  return PickupOption.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single PickupOption from the DB
export function show(req, res) {
  return PickupOption.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new PickupOption in the DB
export function create(req, res) {
  return PickupOption.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given PickupOption in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return PickupOption.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing PickupOption in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return PickupOption.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a PickupOption from the DB
export function destroy(req, res) {
  return PickupOption.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
