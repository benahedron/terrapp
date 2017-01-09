'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var optionsCtrlStub = {
  index: 'optionsCtrl.index',
  show: 'optionsCtrl.show',
  create: 'optionsCtrl.create',
  upsert: 'optionsCtrl.upsert',
  patch: 'optionsCtrl.patch',
  destroy: 'optionsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var optionsIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './options.controller': optionsCtrlStub
});

describe('Options API Router:', function() {
  it('should return an express router instance', function() {
    optionsIndex.should.equal(routerStub);
  });

  describe('GET /api/options', function() {
    it('should route to options.controller.index', function() {
      routerStub.get
        .withArgs('/', 'optionsCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/options/:id', function() {
    it('should route to options.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'optionsCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/options', function() {
    it('should route to options.controller.create', function() {
      routerStub.post
        .withArgs('/', 'optionsCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/options/:id', function() {
    it('should route to options.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'optionsCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/options/:id', function() {
    it('should route to options.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'optionsCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/options/:id', function() {
    it('should route to options.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'optionsCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
