'use strict';

module.exports = sdUserListCtrl;

function sdUserListCtrl($scope, sdUser) {
    $scope.users = sdUser.query();
}