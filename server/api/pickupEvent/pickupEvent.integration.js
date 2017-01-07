'use strict';

var app = require('../..');
import request from 'supertest';

var newPickupEvent;

describe('PickupEvent API:', function() {
  describe('GET /api/pickupEvents', function() {
    var pickupEvents;

    beforeEach(function(done) {
      request(app)
        .get('/api/pickupEvents')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          pickupEvents = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      pickupEvents.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/pickupEvents', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/pickupEvents')
        .send({
          name: 'New PickupEvent',
          info: 'This is the brand new pickupEvent!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPickupEvent = res.body;
          done();
        });
    });

    it('should respond with the newly created pickupEvent', function() {
      newPickupEvent.name.should.equal('New PickupEvent');
      newPickupEvent.info.should.equal('This is the brand new pickupEvent!!!');
    });
  });

  describe('GET /api/pickupEvents/:id', function() {
    var pickupEvent;

    beforeEach(function(done) {
      request(app)
        .get(`/api/pickupEvents/${newPickupEvent._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          pickupEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      pickupEvent = {};
    });

    it('should respond with the requested pickupEvent', function() {
      pickupEvent.name.should.equal('New PickupEvent');
      pickupEvent.info.should.equal('This is the brand new pickupEvent!!!');
    });
  });

  describe('PUT /api/pickupEvents/:id', function() {
    var updatedPickupEvent;

    beforeEach(function(done) {
      request(app)
        .put(`/api/pickupEvents/${newPickupEvent._id}`)
        .send({
          name: 'Updated PickupEvent',
          info: 'This is the updated pickupEvent!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPickupEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPickupEvent = {};
    });

    it('should respond with the updated pickupEvent', function() {
      updatedPickupEvent.name.should.equal('Updated PickupEvent');
      updatedPickupEvent.info.should.equal('This is the updated pickupEvent!!!');
    });

    it('should respond with the updated pickupEvent on a subsequent GET', function(done) {
      request(app)
        .get(`/api/pickupEvents/${newPickupEvent._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let pickupEvent = res.body;

          pickupEvent.name.should.equal('Updated PickupEvent');
          pickupEvent.info.should.equal('This is the updated pickupEvent!!!');

          done();
        });
    });
  });

  describe('PATCH /api/pickupEvents/:id', function() {
    var patchedPickupEvent;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/pickupEvents/${newPickupEvent._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched PickupEvent' },
          { op: 'replace', path: '/info', value: 'This is the patched pickupEvent!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPickupEvent = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPickupEvent = {};
    });

    it('should respond with the patched pickupEvent', function() {
      patchedPickupEvent.name.should.equal('Patched PickupEvent');
      patchedPickupEvent.info.should.equal('This is the patched pickupEvent!!!');
    });
  });

  describe('DELETE /api/pickupEvents/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/pickupEvents/${newPickupEvent._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pickupEvent does not exist', function(done) {
      request(app)
        .delete(`/api/pickupEvents/${newPickupEvent._id}`)
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
