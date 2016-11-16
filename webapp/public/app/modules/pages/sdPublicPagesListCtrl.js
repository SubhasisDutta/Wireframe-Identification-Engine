/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdPublicPagesListCtrl;

function sdPublicPagesListCtrl ($scope, $resource) {
    $scope.perPage = 20;
    $scope.maxSize = 5;

    function getResult() {
        var pageNo = 1;
        if($scope.publicWireframes && $scope.publicWireframes.page){
            pageNo = $scope.publicWireframes.page;
        }
        var publicPages = $resource("/api/publicpages/" + pageNo + "/" + $scope.perPage);
        $scope.publicWireframes = publicPages.get();
    }
    getResult();

    $scope.pageChanged = function() {
        getResult();
    };

    $scope.sortOptions = [{value: "-uploaded_on", text: "Sort by Upload Date"},
        {value: "title", text: "Sort by Title"},
        {value: "no_of_controls", text: "Sort by No of Controls"}];
    $scope.sortOrder = $scope.sortOptions[0].value;
}