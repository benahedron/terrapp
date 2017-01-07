'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var pickupUserEventCtrlStub = {
  index: 'pickupUserEventCtrl.index',
  show: 'pickupUserEventCtrl.show',
  create: 'pickupUserEventCtrl.create',
  upsert: 'pickupUserEventCtrl.upsert',
  patch: 'pickupUserEventCtrl.patch',
  destroy: 'pickupUserEventCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var pickupUserEventIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './pickupUserEvent.controller': pickupUserEventCtrlStub
});

describe('PickupUserEvent API Router:', function() {
  it('should return an express router instance', function() {
    pickupUserEventIndex.should.equal(routerStub);
  });

  describe('GET /api/pickupUserEvents', function() {
    it('should route to pickupUserEvent.controller.index', function() {
      routerStub.get
        .withArgs('/', 'pickupUserEventCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/pickupUserEvents/:id', function() {
    it('should route to pickupUserEvent.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'pickupUserEventCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/pickupUserEvents', function() {
    it('should route to pickupUserEvent.controller.create', function() {
      routerStub.post
        .withArgs('/', 'pickupUserEventCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/pickupUserEvents/:id', function() {
    it('should route to pickupUserEvent.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'pickupUserEventCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/pickupUserEvents/:id', function() {
    it('should route to pickupUserEvent.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'pickupUserEventCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/pickupUserEvents/:id', function() {
    it('should route to pickupUserEvent.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'pickupUserEventCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
