'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var basketCtrlStub = {
  index: 'basketCtrl.index',
  show: 'basketCtrl.show',
  create: 'basketCtrl.create',
  upsert: 'basketCtrl.upsert',
  patch: 'basketCtrl.patch',
  destroy: 'basketCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var basketIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './basket.controller': basketCtrlStub
});

describe('Basket API Router:', function() {
  it('should return an express router instance', function() {
    basketIndex.should.equal(routerStub);
  });

  describe('GET /api/baskets', function() {
    it('should route to basket.controller.index', function() {
      routerStub.get
        .withArgs('/', 'basketCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/baskets/:id', function() {
    it('should route to basket.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'basketCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/baskets', function() {
    it('should route to basket.controller.create', function() {
      routerStub.post
        .withArgs('/', 'basketCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/baskets/:id', function() {
    it('should route to basket.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'basketCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/baskets/:id', function() {
    it('should route to basket.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'basketCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/baskets/:id', function() {
    it('should route to basket.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'basketCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
