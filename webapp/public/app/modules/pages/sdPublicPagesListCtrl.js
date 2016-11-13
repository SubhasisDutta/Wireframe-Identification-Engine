/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdPublicPagesListCtrl;

function sdPublicPagesListCtrl ($scope, $resource) {
    var publicPages = $resource("/api/publicpages");
    $scope.publicWireframes = publicPages.query();

    $scope.sortOptions = [{value: "-uploaded_on", text: "Sort by Upload Date"},
        {value: "title", text: "Sort by Title"},
        {value: "no_of_controls", text: "Sort by No of Controls"}];
    $scope.sortOrder = $scope.sortOptions[0].value;
}