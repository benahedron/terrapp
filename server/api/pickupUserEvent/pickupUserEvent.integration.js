'use strict';

var app = require('../..');
import request from 'supertest';

var newPickupUserEvent;

describe('PickupUserEvent API:', function() {
  describe('GET /api/pickupUserEvents', function() {
    var pickupUserEvents;

    beforeEach(function(done) {
      request(app)
        .get('/api/pickupUserEvents')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          pickupUserEvents = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      pickupUserEvents.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/pickupUserEvents', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/pickupUserEvents')
        .send({
          name: 'New PickupUserEvent',
          info: 'This is the brand new pickupUserEvent!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPickupUserEvent = res.body;
          done();
        });
    });

    it('should respond with the newly created pickupUserEvent', function() {
      newPickupUserEvent.name.should.equal('New PickupUserEvent');
      newPickupUserEvent.info.should.equal('This is the brand new pickupUserEvent!!!');
    });
  });

  describe('GET /api/pickupUserEvents/:id', function() {
    var pickupUserEvent;

    beforeEach(function(done) {
      request(app)
        .get(`/api/pickupUserEvents/${newPickupUserEvent._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          pickupUserEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      pickupUserEvent = {};
    });

    it('should respond with the requested pickupUserEvent', function() {
      pickupUserEvent.name.should.equal('New PickupUserEvent');
      pickupUserEvent.info.should.equal('This is the brand new pickupUserEvent!!!');
    });
  });

  describe('PUT /api/pickupUserEvents/:id', function() {
    var updatedPickupUserEvent;

    beforeEach(function(done) {
      request(app)
        .put(`/api/pickupUserEvents/${newPickupUserEvent._id}`)
        .send({
          name: 'Updated PickupUserEvent',
          info: 'This is the updated pickupUserEvent!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPickupUserEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPickupUserEvent = {};
    });

    it('should respond with the updated pickupUserEvent', function() {
      updatedPickupUserEvent.name.should.equal('Updated PickupUserEvent');
      updatedPickupUserEvent.info.should.equal('This is the updated pickupUserEvent!!!');
    });

    it('should respond with the updated pickupUserEvent on a subsequent GET', function(done) {
      request(app)
        .get(`/api/pickupUserEvents/${newPickupUserEvent._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let pickupUserEvent = res.body;

          pickupUserEvent.name.should.equal('Updated PickupUserEvent');
          pickupUserEvent.info.should.equal('This is the updated pickupUserEvent!!!');

          done();
        });
    });
  });

  describe('PATCH /api/pickupUserEvents/:id', function() {
    var patchedPickupUserEvent;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/pickupUserEvents/${newPickupUserEvent._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched PickupUserEvent' },
          { op: 'replace', path: '/info', value: 'This is the patched pickupUserEvent!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPickupUserEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPickupUserEvent = {};
    });

    it('should respond with the patched pickupUserEvent', function() {
      patchedPickupUserEvent.name.should.equal('Patched PickupUserEvent');
      patchedPickupUserEvent.info.should.equal('This is the patched pickupUserEvent!!!');
    });
  });

  describe('DELETE /api/pickupUserEvents/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/pickupUserEvents/${newPickupUserEvent._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pickupUserEvent does not exist', function(done) {
      request(app)
        .delete(`/api/pickupUserEvents/${newPickupUserEvent._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
