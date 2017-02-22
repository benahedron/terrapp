/**
 * Using Rails-like standard naming convention for endpoints.
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import ExtraEvent from './extraEvent.model';
import _ from 'lodash'

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
      _.assign(entity, patches);
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

// Gets a list of ExtraEvents
export function index(req, res) {
  return ExtraEvent.find({season: req.params.seasonId}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ExtraEvent in the DB
export function create(req, res) {
  return ExtraEvent.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ExtraEvent in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }

  return ExtraEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ExtraEvent from the DB
export function destroy(req, res) {
  return ExtraEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
