'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var pickupOptionCtrlStub = {
  index: 'pickupOptionCtrl.index',
  show: 'pickupOptionCtrl.show',
  create: 'pickupOptionCtrl.create',
  upsert: 'pickupOptionCtrl.upsert',
  patch: 'pickupOptionCtrl.patch',
  destroy: 'pickupOptionCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var pickupOptionIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './pickupOption.controller': pickupOptionCtrlStub
});

describe('PickupOption API Router:', function() {
  it('should return an express router instance', function() {
    pickupOptionIndex.should.equal(routerStub);
  });

  describe('GET /api/pickupOptions', function() {
    it('should route to pickupOption.controller.index', function() {
      routerStub.get
        .withArgs('/', 'pickupOptionCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/pickupOptions/:id', function() {
    it('should route to pickupOption.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'pickupOptionCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/pickupOptions', function() {
    it('should route to pickupOption.controller.create', function() {
      routerStub.post
        .withArgs('/', 'pickupOptionCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/pickupOptions/:id', function() {
    it('should route to pickupOption.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'pickupOptionCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/pickupOptions/:id', function() {
    it('should route to pickupOption.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'pickupOptionCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/pickupOptions/:id', function() {
    it('should route to pickupOption.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'pickupOptionCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
