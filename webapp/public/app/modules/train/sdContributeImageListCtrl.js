/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdContributeImageLabelCtrl;

function sdContributeImageLabelCtrl($scope, sdIdentity, $resource, sdNotifier) {
    $scope.userApps = [];
    var userContributeData = $resource("/api/contribute/userImages");
    if (sdIdentity.currentUser !== undefined) {
        $scope.identity = sdIdentity;
        $scope.userContributeData = userContributeData.query();
    }

    $scope.sortOptions = [{value: "-uploaded_on", text: "Sort by Upload Date"},
        {value: "actual_label", text: "Sort by Label"}];
    $scope.sortOrder = $scope.sortOptions[0].value;

    $scope.deleteControl = function (imageId) {
        var removeResource = new $resource('/api/contribute/removeControl/:_id',
            {_id: imageId},
            {'update': {method: 'PUT'}});
        removeResource.update().$promise.then(function(response) {
            sdNotifier.notify(response.message);
            if(response.code === 200) {
                $scope.userContributeData = userContributeData.query();
            }
        });
    }

}