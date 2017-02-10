/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/pickupEvents              ->  index
 * POST    /api/pickupEvents              ->  create
 * GET     /api/pickupEvents/:id          ->  show
 * PUT     /api/pickupEvents/:id          ->  upsert
 * PATCH   /api/pickupEvents/:id          ->  patch
 * DELETE  /api/pickupEvents/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import PickupEvent from './pickupEvent.model';
import * as PickupEventLogic from '../../components/utils/pickupEvent.logic'
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

// Gets a list of PickupEvents
export function index(req, res) {
  return PickupEvent.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Get list of alternative pickup events at this moment of time
export function getAlternatives(req, res) {
  return PickupEvent.findById(req.params.id).exec()
    .then((pickupEvent, err) => {
      return new Promise(function(fulfill, reject) {
        return PickupEventLogic.getAlternativesFor(pickupEvent, fulfill);
      });
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Get a lost of PickupEvents for a given season and pickup option
export function indexPrecise(req, res) {
  let query = {season: req.params.seasonId};
  if (req.params.pickupOptionId && req.params.pickupOptionId != null && req.params.pickupOptionId != 'null' && req.params.pickupOptionId != 0) {
    query.pickupOption = req.params.pickupOptionId;
  }
  if (req.params.interval != 0 && parseInt(req.params.interval)>0) {
    query.eventNumber = parseInt(req.params.interval)-1;
  }
  return PickupEvent.find(query).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single PickupEvent from the DB
export function show(req, res) {
  return PickupEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new PickupEvent in the DB
export function create(req, res) {
  return PickupEvent.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given PickupEvent in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return PickupEvent.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing PickupEvent in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }

  return PickupEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    //.catch(handleError(res));
}

// Deletes a PickupEvent from the DB
export function destroy(req, res) {
  return PickupEvent.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Send an e-mail to the customers of an event
export function sendMail(req, res) {
  return PickupEvent.findById(req.params.pickupId).exec()
    .then(pickupEvent => {
      let mail = _.find(pickupEvent.mails, mail => {
        return mail._id+'' === req.params.mailId;
      });
      if (mail && !mail.date) {
        // Send
        PickupEventLogic.sendMail(pickupEvent, mail, (sent) => {
          if (sent) {
            mail.date = new Date();
            mail.sent = true;
            return pickupEvent.save();
          } else {
            return handleError(res);
          }
        });
      } else {
        return handleError(res);
      }
    })
    .then(respondWithResult(res))
    //.catch(handleError(res));
}
