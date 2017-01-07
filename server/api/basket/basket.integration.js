'use strict';

var app = require('../..');
import request from 'supertest';

var newBasket;

describe('Basket API:', function() {
  describe('GET /api/baskets', function() {
    var baskets;

    beforeEach(function(done) {
      request(app)
        .get('/api/baskets')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          baskets = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      baskets.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/baskets', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/baskets')
        .send({
          name: 'New Basket',
          info: 'This is the brand new basket!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newBasket = res.body;
          done();
        });
    });

    it('should respond with the newly created basket', function() {
      newBasket.name.should.equal('New Basket');
      newBasket.info.should.equal('This is the brand new basket!!!');
    });
  });

  describe('GET /api/baskets/:id', function() {
    var basket;

    beforeEach(function(done) {
      request(app)
        .get(`/api/baskets/${newBasket._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          basket = res.body;
          done();
        });
    });

    afterEach(function() {
      basket = {};
    });

    it('should respond with the requested basket', function() {
      basket.name.should.equal('New Basket');
      basket.info.should.equal('This is the brand new basket!!!');
    });
  });

  describe('PUT /api/baskets/:id', function() {
    var updatedBasket;

    beforeEach(function(done) {
      request(app)
        .put(`/api/baskets/${newBasket._id}`)
        .send({
          name: 'Updated Basket',
          info: 'This is the updated basket!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedBasket = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBasket = {};
    });

    it('should respond with the updated basket', function() {
      updatedBasket.name.should.equal('Updated Basket');
      updatedBasket.info.should.equal('This is the updated basket!!!');
    });

    it('should respond with the updated basket on a subsequent GET', function(done) {
      request(app)
        .get(`/api/baskets/${newBasket._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let basket = res.body;

          basket.name.should.equal('Updated Basket');
          basket.info.should.equal('This is the updated basket!!!');

          done();
        });
    });
  });

  describe('PATCH /api/baskets/:id', function() {
    var patchedBasket;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/baskets/${newBasket._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Basket' },
          { op: 'replace', path: '/info', value: 'This is the patched basket!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedBasket = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedBasket = {};
    });

    it('should respond with the patched basket', function() {
      patchedBasket.name.should.equal('Patched Basket');
      patchedBasket.info.should.equal('This is the patched basket!!!');
    });
  });

  describe('DELETE /api/baskets/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/baskets/${newBasket._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when basket does not exist', function(done) {
      request(app)
        .delete(`/api/baskets/${newBasket._id}`)
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
