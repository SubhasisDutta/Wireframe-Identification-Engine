angular.module('app').controller('sdProfileCtrl', function($scope, sdAuth, sdIdentity, sdNotifier) {
  $scope.email = sdIdentity.currentUser.username;
  $scope.fname = sdIdentity.currentUser.firstName;
  $scope.lname = sdIdentity.currentUser.lastName;

  $scope.update = function() {
    var newUserData = {
      username: $scope.email,
      firstName: $scope.fname,
      lastName: $scope.lname
    }
    if($scope.password && $scope.password.length > 0) {
      newUserData.password = $scope.password;
    }

    sdAuth.updateCurrentUser(newUserData).then(function() {
      sdNotifier.notify('Your user account has been updated');
    }, function(reason) {
      sdNotifier.error(reason);
    })
  }
})