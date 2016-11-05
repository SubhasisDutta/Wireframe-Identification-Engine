'use strict';

module.exports = sdIdentity;

function sdIdentity($window, sdUser) {
    var currentUser;
    if (!!$window.bootstrappedUserObject) {
        currentUser = new sdUser();
        angular.extend(currentUser, $window.bootstrappedUserObject);
    }
    return {
        currentUser: currentUser,
        isAuthenticated: function () {
            return !!this.currentUser;
        },
        isAuthorized: function (role) {
            return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
        }
    }
}