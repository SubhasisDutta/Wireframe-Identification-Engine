/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdUserPagesListCtrl;

function sdUserPagesListCtrl ($scope, sdIdentity, $resource, sdNotifier, $location, $window) {
    $scope.perPage = 20;
    $scope.maxSize = 5;

    function getResult() {
        var pageNo = 1;
        if($scope.userWireframes && $scope.userWireframes.page){
            pageNo = $scope.userWireframes.page;
        }
        var userPages = $resource("/api/page/userPages/" + pageNo + "/" + $scope.perPage);
        $scope.userWireframes = userPages.get();
    }
    getResult();

    $scope.pageChanged = function() {
        getResult();
    };

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
                getResult();
            }
        });
    };

    $scope.editControl = function(wireframeId) {
        $window.location.href = '/process/annotate/' + wireframeId;
    };
}