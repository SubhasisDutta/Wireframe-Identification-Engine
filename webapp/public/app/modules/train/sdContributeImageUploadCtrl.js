/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdContributeImageUploadCtrl;

function sdContributeImageUploadCtrl($scope, Upload, mvNotifier, $location) {
    $scope.cropper = {};
    $scope.cropper.sourceImage = null;
    $scope.cropper.croppedImage = null;
    $scope.bounds = {};
    $scope.bounds.left = 0;
    $scope.bounds.right = 0;
    $scope.bounds.top = 0;
    $scope.bounds.bottom = 0;

    $scope.uploadCropedImage = function (cropedImage) {
        Upload.upload({
            url: '/api/contribute/upload',
            data: {file: cropedImage, label: $scope.controlLabel, text: $scope.controlText}
        }).then(function (response) {
            if (response.status.code === 200) {
                mvNotifier.notify(response.status.message);
                $location.path('/contribute/upload');
            }
        });


    }


}