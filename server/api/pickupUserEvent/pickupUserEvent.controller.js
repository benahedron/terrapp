/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/pickupUserEvents              ->  index
 * POST    /api/pickupUserEvents              ->  create
 * GET     /api/pickupUserEvents/:id          ->  show
 * PUT     /api/pickupUserEvents/:id          ->  upsert
 * PATCH   /api/pickupUserEvents/:id          ->  patch
 * DELETE  /api/pickupUserEvents/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import PickupUserEvent from './pickupUserEvent.model';

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

// Gets a list of PickupUserEvents
export function index(req, res) {
  return PickupUserEvent.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a list of PickupUserEvents given an  PickupEvent
export function indexByPickupEventId(req, res) {
  return PickupUserEvent.find({'$or': [{pickupEvent: req.params.id, pickupEventOverride: null},{pickupEventOverride: req.params.id}]})
    .populate({path: 'basket', populate: { path: 'membership' }}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Gets a single PickupUserEvent from the DB
export function show(req, res) {
  return PickupUserEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new PickupUserEvent in the DB
export function create(req, res) {
  return PickupUserEvent.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given PickupUserEvent in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return PickupUserEvent.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Update the check state of an event
export function updateDoneState(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return PickupUserEvent.findById(req.params.id).exec()
    .then((pickupUserEvent, err) => {
      pickupUserEvent.done = req.params.value;
      return pickupUserEvent.save();
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Updates an existing PickupUserEvent in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return PickupUserEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a PickupUserEvent from the DB
export function destroy(req, res) {
  return PickupUserEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
