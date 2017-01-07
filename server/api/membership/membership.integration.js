'use strict';

var app = require('../..');
import request from 'supertest';

var newMembership;

describe('Membership API:', function() {
  describe('GET /api/memberships', function() {
    var memberships;

    beforeEach(function(done) {
      request(app)
        .get('/api/memberships')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          memberships = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      memberships.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/memberships', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/memberships')
        .send({
          name: 'New Membership',
          info: 'This is the brand new membership!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newMembership = res.body;
          done();
        });
    });

    it('should respond with the newly created membership', function() {
      newMembership.name.should.equal('New Membership');
      newMembership.info.should.equal('This is the brand new membership!!!');
    });
  });

  describe('GET /api/memberships/:id', function() {
    var membership;

    beforeEach(function(done) {
      request(app)
        .get(`/api/memberships/${newMembership._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          membership = res.body;
          done();
        });
    });

    afterEach(function() {
      membership = {};
    });

    it('should respond with the requested membership', function() {
      membership.name.should.equal('New Membership');
      membership.info.should.equal('This is the brand new membership!!!');
    });
  });

  describe('PUT /api/memberships/:id', function() {
    var updatedMembership;

    beforeEach(function(done) {
      request(app)
        .put(`/api/memberships/${newMembership._id}`)
        .send({
          name: 'Updated Membership',
          info: 'This is the updated membership!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedMembership = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMembership = {};
    });

    it('should respond with the updated membership', function() {
      updatedMembership.name.should.equal('Updated Membership');
      updatedMembership.info.should.equal('This is the updated membership!!!');
    });

    it('should respond with the updated membership on a subsequent GET', function(done) {
      request(app)
        .get(`/api/memberships/${newMembership._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let membership = res.body;

          membership.name.should.equal('Updated Membership');
          membership.info.should.equal('This is the updated membership!!!');

          done();
        });
    });
  });

  describe('PATCH /api/memberships/:id', function() {
    var patchedMembership;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/memberships/${newMembership._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Membership' },
          { op: 'replace', path: '/info', value: 'This is the patched membership!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedMembership = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedMembership = {};
    });

    it('should respond with the patched membership', function() {
      patchedMembership.name.should.equal('Patched Membership');
      patchedMembership.info.should.equal('This is the patched membership!!!');
    });
  });

  describe('DELETE /api/memberships/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/memberships/${newMembership._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when membership does not exist', function(done) {
      request(app)
        .delete(`/api/memberships/${newMembership._id}`)
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
