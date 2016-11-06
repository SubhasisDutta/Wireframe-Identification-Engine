/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdContributeImageLabelCtrl;

function sdContributeImageLabelCtrl($scope, sdIdentity, $resource) {
    $scope.userApps = [];
    if (sdIdentity.currentUser !== undefined) {
        $scope.identity = sdIdentity;
        var userContributeData = $resource("/api/contribute/userImages");
        $scope.userContributeData = userContributeData.query();
    }

    $scope.sortOptions = [{value: "-uploaded_on", text: "Sort by Upload Date"},
        {value: "actual_label", text: "Sort by Label"}];
    $scope.sortOrder = $scope.sortOptions[0].value;

}