/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdProcessAnnotateCtrl;

function sdProcessAnnotateCtrl($scope, Upload, sdNotifier, $routeParams, $resource) {
    $scope.cropper = {};
    $scope.cropper.sourceImage = null;
    $scope.cropper.croppedImage = null;
    $scope.bounds = {};
    $scope.bounds.left = 0;
    $scope.bounds.right = 0;
    $scope.bounds.top = 0;
    $scope.bounds.bottom = 0;
    var wmRes = $resource("/api/page/detail/:_id");
    wmRes.get({_id: $routeParams.id}, function (response) {
        $scope.wireframeMetadata = response;
        var url = '/api/page/image/' + $scope.wireframeMetadata.wireframeImageId;
        convertFileToDataURLviaFileReader(url, function (base64Img) {
            $scope.cropper.sourceImage = base64Img;
            //TODO: fix the problem when canvas does not load the image until page refresh
            // this is because the template gets loaded without the source image
            //var htmlcontent = angular.element( document.querySelector( '#canvas-annotate-box' ) );
            //htmlcontent.load('/partials/process/annotate-canvas');
            //$compile(htmlcontent.contents())($scope);
        });
    });

    function convertFileToDataURLviaFileReader(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    }

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    }

    $scope.uploadCropedImage = function (cropedImage) {
        var imageFile = dataURLtoFile(cropedImage, 'a.png');
        Upload.upload({
            url: '/api/contribute/upload',
            data: {file: imageFile}
        }).then(function (response) {
            sdNotifier.notify(response.data.message);
        });
    };

    $scope.saveEdit = function () {
        var postingsResource = new $resource('/api/process/updatewireframe/:_id',
            {_id: $routeParams.id},
            {'update': {method: 'PUT'}});
        var saveObj = {
            title: $scope.wireframeMetadata.title,
            acessType: $scope.wireframeMetadata.acessType
        };
        postingsResource.update(saveObj).$promise.then(function(response) {
            sdNotifier.notify(response.message);
        });
    };

    $scope.findSize = function (a, b) {
        var c = Math.abs(a - b);
        return c < 10 ? 10 : c;
    };

    $scope.cropSelectedImage = function (cropedImage, bounds, wireframe_height) {
        var imageFile = dataURLtoFile(cropedImage, 'a.png');
        var wireframeId = $routeParams.id;
        Upload.upload({
            url: '/api/process/uploadcontrol/' + wireframeId,
            data: {wireframe_height: wireframe_height, bounds: bounds, file: imageFile}
        }).then(function (response) {
            sdNotifier.notify(response.data.message);
            if(response.data.code === 200) {
                wmRes.get({_id: $routeParams.id}, function (response) {
                    $scope.wireframeMetadata = response;
                });
            }
        });
    };

    $scope.deleteControl = function (imageId) {
        var removeResource = new $resource('/api/process/removeControl/:_id',
            {_id: $routeParams.id},
            {'update': {method: 'PUT'}});
        var reqObj = {
            controlImageId: imageId
        };
        removeResource.update(reqObj).$promise.then(function(response) {
            sdNotifier.notify(response.message);
            if(response.code === 200) {
                wmRes.get({_id: $routeParams.id}, function (response) {
                    $scope.wireframeMetadata = response;
                });
            }
        });
    };

    $scope.createZip = function () {
        var createZipResource = new $resource('/api/process/createdownloadzip/:_id',
            {_id: $routeParams.id},
            {'update': {method: 'PUT'}});
        createZipResource.update().$promise.then(function(response) {
            sdNotifier.notify(response.message);
        })
    };
}