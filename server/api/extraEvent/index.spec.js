'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var extraEventCtrlStub = {
  index: 'extraEventCtrl.index',
  show: 'extraEventCtrl.show',
  create: 'extraEventCtrl.create',
  upsert: 'extraEventCtrl.upsert',
  patch: 'extraEventCtrl.patch',
  destroy: 'extraEventCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var extraEventIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './extraEvent.controller': extraEventCtrlStub
});

describe('ExtraEvent API Router:', function() {
  it('should return an express router instance', function() {
    extraEventIndex.should.equal(routerStub);
  });

  describe('GET /api/extraEvents', function() {
    it('should route to extraEvent.controller.index', function() {
      routerStub.get
        .withArgs('/', 'extraEventCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/extraEvents/:id', function() {
    it('should route to extraEvent.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'extraEventCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/extraEvents', function() {
    it('should route to extraEvent.controller.create', function() {
      routerStub.post
        .withArgs('/', 'extraEventCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/extraEvents/:id', function() {
    it('should route to extraEvent.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'extraEventCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/extraEvents/:id', function() {
    it('should route to extraEvent.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'extraEventCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/extraEvents/:id', function() {
    it('should route to extraEvent.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'extraEventCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
