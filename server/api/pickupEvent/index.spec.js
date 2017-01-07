'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var pickupEventCtrlStub = {
  index: 'pickupEventCtrl.index',
  show: 'pickupEventCtrl.show',
  create: 'pickupEventCtrl.create',
  upsert: 'pickupEventCtrl.upsert',
  patch: 'pickupEventCtrl.patch',
  destroy: 'pickupEventCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var pickupEventIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './pickupEvent.controller': pickupEventCtrlStub
});

describe('PickupEvent API Router:', function() {
  it('should return an express router instance', function() {
    pickupEventIndex.should.equal(routerStub);
  });

  describe('GET /api/pickupEvents', function() {
    it('should route to pickupEvent.controller.index', function() {
      routerStub.get
        .withArgs('/', 'pickupEventCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/pickupEvents/:id', function() {
    it('should route to pickupEvent.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'pickupEventCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/pickupEvents', function() {
    it('should route to pickupEvent.controller.create', function() {
      routerStub.post
        .withArgs('/', 'pickupEventCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/pickupEvents/:id', function() {
    it('should route to pickupEvent.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'pickupEventCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/pickupEvents/:id', function() {
    it('should route to pickupEvent.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'pickupEventCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/pickupEvents/:id', function() {
    it('should route to pickupEvent.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'pickupEventCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
