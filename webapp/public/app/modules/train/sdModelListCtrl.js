/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdModelListCtrl;

function sdModelListCtrl ($scope, $resource, sdNotifier, sdUser) {
    $scope.perPage = 25;
    $scope.maxSize = 5;

    $scope.selectedUsers = ["All"];
    $scope.selectedControls = ["All"];

    $scope.users = sdUser.query();


    function getResult() {
        var pageNo = 1;
        if($scope.modelList && $scope.modelList.page){
            pageNo = $scope.modelList.page;
        }
        var modelListResource = $resource("/api/modeldownloadlist/" + pageNo + "/" + $scope.perPage);
        $scope.modelList = modelListResource.get();
    }
    getResult();

    $scope.pageChanged = function() {
        getResult();
    };

    $scope.sortOptions = [{value: "-uploaded_on", text: "Sort by Upload Date"},
        {value: "username", text: "Sort by User Name"}];
    $scope.sortOrder = $scope.sortOptions[0].value;

    $scope.triggerZipCreation = function (selectedUsers, selectedControls) {
        if(selectedUsers.indexOf("All") > -1) {
            selectedUsers = ["All"]
        }
        if(selectedControls.indexOf("All") > -1) {
            selectedControls = ["All"]
        }
        var createZipResource = new $resource('/api/train/createdownloadzip',{}, {'update': {method: 'PUT'}});
        var reqObj = {
            selectedUsers: selectedUsers,
            selectedControls: selectedControls
        };
        createZipResource.update(reqObj).$promise.then(function(response) {
            sdNotifier.notify(response.message);
        });
    };

}