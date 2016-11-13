/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdPageDetailCtrl;

function sdPageDetailCtrl ($scope, $routeParams, $resource) {
    var wmRes = $resource("/api/page/detail/:_id");
    wmRes.get({_id: $routeParams.id}, function (response) {
        $scope.wireframeMetadata = response;
    });
}