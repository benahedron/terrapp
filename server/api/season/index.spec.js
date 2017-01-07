'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var seasonCtrlStub = {
  index: 'seasonCtrl.index',
  show: 'seasonCtrl.show',
  create: 'seasonCtrl.create',
  upsert: 'seasonCtrl.upsert',
  patch: 'seasonCtrl.patch',
  destroy: 'seasonCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var seasonIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './season.controller': seasonCtrlStub
});

describe('Season API Router:', function() {
  it('should return an express router instance', function() {
    seasonIndex.should.equal(routerStub);
  });

  describe('GET /api/seasons', function() {
    it('should route to season.controller.index', function() {
      routerStub.get
        .withArgs('/', 'seasonCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/seasons/:id', function() {
    it('should route to season.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'seasonCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/seasons', function() {
    it('should route to season.controller.create', function() {
      routerStub.post
        .withArgs('/', 'seasonCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/seasons/:id', function() {
    it('should route to season.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'seasonCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/seasons/:id', function() {
    it('should route to season.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'seasonCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/seasons/:id', function() {
    it('should route to season.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'seasonCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
