/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/baskets              ->  index
 * POST    /api/baskets              ->  create
 * GET     /api/baskets/:id          ->  show
 * PUT     /api/baskets/:id          ->  upsert
 * PATCH   /api/baskets/:id          ->  patch
 * DELETE  /api/baskets/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Basket from './basket.model';

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

// Gets a list of Baskets
export function index(req, res) {
  return Basket.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of Baskets by season
export function indexBySeason(req, res) {
  return Basket.find({season: req.params.seasonId}).populate('membership defaultPickupOption').exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Basket from the DB
export function show(req, res) {
  return Basket.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Basket in the DB
export function create(req, res) {
  return Basket.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Basket in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Basket.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Basket in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Basket.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Basket from the DB
export function destroy(req, res) {
  return Basket.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
