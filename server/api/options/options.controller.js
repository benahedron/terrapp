/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/options              ->  index
 * POST    /api/options              ->  create
 * GET     /api/options/:id          ->  show
 * PUT     /api/options/:id          ->  upsert
 * PATCH   /api/options/:id          ->  patch
 * DELETE  /api/options/:id          ->  destroy
 */

'use strict';

import Options from './options.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity.value);
    }
    return null;
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

// Gets a single Options from the DB
export function load(req, res) {
  return Options.findOne({name: req.params.name}).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Options in the DB
export function save(req, res) {
  return Options.findOne({name: req.params.name}).exec()
    .then(entity => {
      if(!entity) {
        return Options.create({name: req.params.name, value: req.body.value});
      } else {
        entity.value = req.body.value;
        return entity.save();
      }
    })
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Options in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Options.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}
