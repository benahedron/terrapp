'use strict';

var app = require('../..');
import request from 'supertest';

var newPickupOption;

describe('PickupOption API:', function() {
  describe('GET /api/pickupOptions', function() {
    var pickupOptions;

    beforeEach(function(done) {
      request(app)
        .get('/api/pickupOptions')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          pickupOptions = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      pickupOptions.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/pickupOptions', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/pickupOptions')
        .send({
          name: 'New PickupOption',
          info: 'This is the brand new pickupOption!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newPickupOption = res.body;
          done();
        });
    });

    it('should respond with the newly created pickupOption', function() {
      newPickupOption.name.should.equal('New PickupOption');
      newPickupOption.info.should.equal('This is the brand new pickupOption!!!');
    });
  });

  describe('GET /api/pickupOptions/:id', function() {
    var pickupOption;

    beforeEach(function(done) {
      request(app)
        .get(`/api/pickupOptions/${newPickupOption._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          pickupOption = res.body;
          done();
        });
    });

    afterEach(function() {
      pickupOption = {};
    });

    it('should respond with the requested pickupOption', function() {
      pickupOption.name.should.equal('New PickupOption');
      pickupOption.info.should.equal('This is the brand new pickupOption!!!');
    });
  });

  describe('PUT /api/pickupOptions/:id', function() {
    var updatedPickupOption;

    beforeEach(function(done) {
      request(app)
        .put(`/api/pickupOptions/${newPickupOption._id}`)
        .send({
          name: 'Updated PickupOption',
          info: 'This is the updated pickupOption!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedPickupOption = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPickupOption = {};
    });

    it('should respond with the updated pickupOption', function() {
      updatedPickupOption.name.should.equal('Updated PickupOption');
      updatedPickupOption.info.should.equal('This is the updated pickupOption!!!');
    });

    it('should respond with the updated pickupOption on a subsequent GET', function(done) {
      request(app)
        .get(`/api/pickupOptions/${newPickupOption._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let pickupOption = res.body;

          pickupOption.name.should.equal('Updated PickupOption');
          pickupOption.info.should.equal('This is the updated pickupOption!!!');

          done();
        });
    });
  });

  describe('PATCH /api/pickupOptions/:id', function() {
    var patchedPickupOption;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/pickupOptions/${newPickupOption._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched PickupOption' },
          { op: 'replace', path: '/info', value: 'This is the patched pickupOption!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedPickupOption = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedPickupOption = {};
    });

    it('should respond with the patched pickupOption', function() {
      patchedPickupOption.name.should.equal('Patched PickupOption');
      patchedPickupOption.info.should.equal('This is the patched pickupOption!!!');
    });
  });

  describe('DELETE /api/pickupOptions/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/pickupOptions/${newPickupOption._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pickupOption does not exist', function(done) {
      request(app)
        .delete(`/api/pickupOptions/${newPickupOption._id}`)
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
