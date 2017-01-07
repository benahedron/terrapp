'use strict';

var app = require('../..');
import request from 'supertest';

var newSeason;

describe('Season API:', function() {
  describe('GET /api/seasons', function() {
    var seasons;

    beforeEach(function(done) {
      request(app)
        .get('/api/seasons')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          seasons = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      seasons.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/seasons', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/seasons')
        .send({
          name: 'New Season',
          info: 'This is the brand new season!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newSeason = res.body;
          done();
        });
    });

    it('should respond with the newly created season', function() {
      newSeason.name.should.equal('New Season');
      newSeason.info.should.equal('This is the brand new season!!!');
    });
  });

  describe('GET /api/seasons/:id', function() {
    var season;

    beforeEach(function(done) {
      request(app)
        .get(`/api/seasons/${newSeason._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          season = res.body;
          done();
        });
    });

    afterEach(function() {
      season = {};
    });

    it('should respond with the requested season', function() {
      season.name.should.equal('New Season');
      season.info.should.equal('This is the brand new season!!!');
    });
  });

  describe('PUT /api/seasons/:id', function() {
    var updatedSeason;

    beforeEach(function(done) {
      request(app)
        .put(`/api/seasons/${newSeason._id}`)
        .send({
          name: 'Updated Season',
          info: 'This is the updated season!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedSeason = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedSeason = {};
    });

    it('should respond with the updated season', function() {
      updatedSeason.name.should.equal('Updated Season');
      updatedSeason.info.should.equal('This is the updated season!!!');
    });

    it('should respond with the updated season on a subsequent GET', function(done) {
      request(app)
        .get(`/api/seasons/${newSeason._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let season = res.body;

          season.name.should.equal('Updated Season');
          season.info.should.equal('This is the updated season!!!');

          done();
        });
    });
  });

  describe('PATCH /api/seasons/:id', function() {
    var patchedSeason;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/seasons/${newSeason._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Season' },
          { op: 'replace', path: '/info', value: 'This is the patched season!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedSeason = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedSeason = {};
    });

    it('should respond with the patched season', function() {
      patchedSeason.name.should.equal('Patched Season');
      patchedSeason.info.should.equal('This is the patched season!!!');
    });
  });

  describe('DELETE /api/seasons/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/seasons/${newSeason._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when season does not exist', function(done) {
      request(app)
        .delete(`/api/seasons/${newSeason._id}`)
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
