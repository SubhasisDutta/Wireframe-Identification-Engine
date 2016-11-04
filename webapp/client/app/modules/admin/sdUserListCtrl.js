angular.module('app').controller('sdUserListCtrl', function($scope, sdUser) {
  $scope.users = sdUser.query();
});