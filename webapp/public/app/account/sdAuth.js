angular.module('app').factory('sdAuth', function($http, sdIdentity, $q, sdUser) {
  return {
    authenticateUser: function(username, password) {
      var dfd = $q.defer();
      $http.post('/login', {username:username, password:password}).then(function(response) {
        if(response.data.success) {
          var user = new sdUser();
          angular.extend(user, response.data.user);
          sdIdentity.currentUser = user;
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
      return dfd.promise;
    },

    createUser: function(newUserData) {
      var newUser = new sdUser(newUserData);
      var dfd = $q.defer();

      newUser.$save().then(function() {
        sdIdentity.currentUser = newUser;
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },

    updateCurrentUser: function(newUserData) {
      var dfd = $q.defer();

      var clone = angular.copy(sdIdentity.currentUser);
      angular.extend(clone, newUserData);
      clone.$update().then(function() {
        sdIdentity.currentUser = clone;
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },

    logoutUser: function() {
      var dfd = $q.defer();
      $http.post('/logout', {logout:true}).then(function() {
        sdIdentity.currentUser = undefined;
        dfd.resolve();
      });
      return dfd.promise;
    },
    authorizeCurrentUserForRoute: function(role) {
      if(sdIdentity.isAuthorized(role)) {
        return true;
      } else {
        return $q.reject('not authorized');
      }

    },
    authorizeAuthenticatedUserForRoute: function() {
      if(sdIdentity.isAuthenticated()) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    }
  }
});