'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var membershipCtrlStub = {
  index: 'membershipCtrl.index',
  show: 'membershipCtrl.show',
  create: 'membershipCtrl.create',
  upsert: 'membershipCtrl.upsert',
  patch: 'membershipCtrl.patch',
  destroy: 'membershipCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var membershipIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './membership.controller': membershipCtrlStub
});

describe('Membership API Router:', function() {
  it('should return an express router instance', function() {
    membershipIndex.should.equal(routerStub);
  });

  describe('GET /api/memberships', function() {
    it('should route to membership.controller.index', function() {
      routerStub.get
        .withArgs('/', 'membershipCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/memberships/:id', function() {
    it('should route to membership.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'membershipCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/memberships', function() {
    it('should route to membership.controller.create', function() {
      routerStub.post
        .withArgs('/', 'membershipCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/memberships/:id', function() {
    it('should route to membership.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'membershipCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/memberships/:id', function() {
    it('should route to membership.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'membershipCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/memberships/:id', function() {
    it('should route to membership.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'membershipCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
