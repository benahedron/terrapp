'use strict';

export class ModalBase {
  $uibModal: ng.ui.bootstrap.IModalService;

  constructor($uibModal: ng.ui.bootstrap.IModalService) {
    this.$uibModal = $uibModal;
  }

  modal(component: string, resolve: Object, successCallback: Function, options?) {
    let scope = this;
    var modalInstance = this.$uibModal.open(_.merge({
        component: component,
        resolve: resolve
    }, options || {}) as ng.ui.bootstrap.IModalSettings);

    return modalInstance.result.then((result) => {
      successCallback(result);
    });
  }
}
