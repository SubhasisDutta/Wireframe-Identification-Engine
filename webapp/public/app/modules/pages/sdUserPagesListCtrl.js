/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdUserPagesListCtrl;

function sdUserPagesListCtrl ($scope, sdIdentity, $resource, sdNotifier, $location) {
    $scope.userApps = [];
    var userPages = $resource("/api/page/userPages");
    if (sdIdentity.currentUser !== undefined) {
        $scope.identity = sdIdentity;
        $scope.userWireframes = userPages.query();
    }

    $scope.sortOptions = [{value: "-uploaded_on", text: "Sort by Upload Date"},
        {value: "title", text: "Sort by Title"},
        {value: "no_of_controls", text: "Sort by No of Controls"}];
    $scope.sortOrder = $scope.sortOptions[0].value;

    $scope.deleteControl = function (wireframeId) {
        var removeResource = new $resource('/api/page/removeWireframe/:_id',
            {_id: wireframeId},
            {'update': {method: 'PUT'}});
        removeResource.update().$promise.then(function(response) {
            sdNotifier.notify(response.message);
            if(response.code === 200) {
                $scope.userWireframes = userPages.query();
            }
        });
    };

    $scope.editControl = function(wireframeId) {
        $location.path('/process/annotate/' + wireframeId);
    };
}