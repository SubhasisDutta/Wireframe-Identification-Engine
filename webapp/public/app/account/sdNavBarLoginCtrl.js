angular.module('app').controller('sdNavBarLoginCtrl', function($scope, $http, sdIdentity, sdNotifier, sdAuth, $location) {
  $scope.identity = sdIdentity;
  $scope.signin = function(username, password) {
    sdAuth.authenticateUser(username, password).then(function(success) {
      if(success) {
        sdNotifier.notify('You have successfully signed in!');
          $location.path('/');
      } else {
        sdNotifier.notify('Username/Password combination incorrect');
      }
    });
  }

  $scope.signout = function() {
    sdAuth.logoutUser().then(function() {
      $scope.username = "";
      $scope.password = "";
      sdNotifier.notify('You have successfully signed out!');
      $location.path('/');
    })
  }
});