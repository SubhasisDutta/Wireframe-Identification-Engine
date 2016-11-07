/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdProcessUploadCtrl;

function sdProcessUploadCtrl ($scope, Upload, sdNotifier, $location) {
    $scope.cropper = {};
    $scope.cropper.sourceImage = null;
    $scope.cropper.croppedImage = null;
    $scope.bounds = {};
    $scope.bounds.left = 0;
    $scope.bounds.right = 0;
    $scope.bounds.top = 0;
    $scope.bounds.bottom = 0;

    $scope.findSize = function (a, b) {
        var c = Math.abs(a - b);
        return c < 200 ? 200: c;
    };
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    $scope.uploadCropedImage = function (cropedImage, width, height) {
        var imageFile = dataURLtoFile(cropedImage, 'a.png');
        Upload.upload({
            url: '/api/process/upload',
            data: {width: width, height: height, file: imageFile}
        }).then(function (response) {
            sdNotifier.notify(response.data.message);
            if (response.data.code === 200) {
                $location.path('/api/process/annotate/' + response.data.id);
            }
        });
    }
}