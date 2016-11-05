'use strict';

module.exports = sdSignupCtrl;

function sdSignupCtrl($scope, sdUser, sdNotifier, $location, sdAuth) {
    $scope.signup = function () {
        var newUserData = {
            username: $scope.email,
            password: $scope.password,
            firstName: $scope.fname,
            lastName: $scope.lname
        };

        sdAuth.createUser(newUserData).then(function () {
            sdNotifier.notify('User account created!');
            $location.path('/');
        }, function (reason) {
            sdNotifier.error(reason);
        });
    }
}