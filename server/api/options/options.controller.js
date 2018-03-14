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
import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import config from '../../config/environment';
import multiparty from 'multiparty';
let exec = require('child_process').exec;

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


export function backup(req, res) {
  var parts = config.mongo.uri.split('/');
  var db = _.last(parts);

  var fileName = 'backup-terrap'+new Date()+'.zip';
  var relFilePath = '"'+__dirname + '/' + fileName + '"';
  var filePath = path.join(__dirname,  '/' + fileName);
  exec('mongodump -d ' + db + ' -o ' + __dirname + '/backup && cd ' + __dirname + '/ &&  zip -e -P "'+config.backup.password+'" -r ' + relFilePath + ' backup && rm -rf ' + __dirname + '/backup', (err, stdout, stderr) => {
    if (err) {
      res.status(500).send(stderr);
    } else {
      res.sendFile(filePath, function() {
        fs.unlinkSync(filePath);
      });
    }
  });
}

export function restore(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    let file = files.file[0];
    var destination = ( __dirname  + '/backup.zip').replace('\.\.');
    var result = fs.createReadStream(file.path+'').pipe(fs.createWriteStream(destination));
    result.on('finish', function(a, b){
      var parts = config.mongo.uri.split('/');
      var db = _.last(parts);
      exec('cd '+ __dirname  + '/' +
        '&& unzip -P "'+config.backup.password+'" backup.zip' +
        '&& mongorestore --db '+db+' backup/' + db +
        '&& rm backup.zip ' +
        '&& rm -rf ' + __dirname + '/backup/' ,
        (err, stdout, stderr) => {
          res.sendStatus(204);
      });
    });
  });
}
