/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdProcessAnnotateCtrl;

function sdProcessAnnotateCtrl($scope, Upload, sdNotifier, $routeParams, $resource, sdPrototypePreviewData) {

    $scope.cropper = {};
    $scope.cropper.sourceImage = null;
    $scope.cropper.croppedImage = null;
    $scope.bounds = {};
    $scope.bounds.left = 0;
    $scope.bounds.right = 200;
    $scope.bounds.top = 0;
    $scope.bounds.bottom = 200;
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
        });
    };

    var sampleData = [
        {
            _id: "5835f1e324a1b174060d125e",
            actual_label: "Button",
            actual_text: "Edit",
            id: "5835f1e324a1b174060d125e",
            image_type: "Model_Train",
            prediction_label: [{provider: "google_label", result: "bag(91%), font(79%), product(78%), automotive exterior(73%), cap(60%), brand(60%), "}],
            prediction_text: [{provider: "google_text", result: "Edit"}],
            status: "Model_To_Approve",
            uploaded_on: "2016-12-07T19:22:02.267Z",
            username: "chaitusbwlr@gmail.com",
            object_height:134,
            object_width:240,
            image_dimention:{top_left_x: 1026, top_left_y: 7, bottom_right_x: 1266, bottom_right_y: 141}
        },
        {
            _id:"5835eaf224a1b174060d122e",
            actual_label:"Button",
            actual_text:"SUBMIT",
            id:"5835eaf224a1b174060d122e",
            image_type:"Model_Train",
            prediction_label:[{provider:"google_label", result:"automotive exterior(75%), font(74%), product(73%), fashion accessory(67%), bag(66%), brand(60%), glasses(56%), "}],
            prediction_text:[{result: "SUBMIT", provider: "google_text"}],
            status:"Model_To_Approve",
            uploaded_on:"2016-12-07T19:22:27.361Z",
            username:"gaby.lui@sap.com",
            object_height:121,
            object_width:303,
            image_dimention:{top_left_x: 470, top_left_y: 987, bottom_right_x: 773, bottom_right_y: 1108}
        },
        {
            _id:"5835f18a24a1b174060d125c",
            actual_label:"Table",
            actual_text:"",
            id:"5835f18a24a1b174060d125c",
            image_type:"Model_Train",
            prediction_label:[{provider:"google_label", result:"line(73%), font(68%), line art(61%), drawing(59%), shape(58%), "}],
            prediction_text:[{result: "Date↵Sport↵Time↵", provider: "google_text"}],
            status:"Model_To_Approve",
            uploaded_on:"2016-12-13T18:44:09.478Z",
            username:"chaitusbwlr@gmail.com",
            object_height:481,
            object_width:548,
            image_dimention:{top_left_x: 17, top_left_y: 487, bottom_right_x: 565, bottom_right_y: 968}
        },
        {
            _id:"5835ede024a1b174060d123e",
            actual_label:"Text",
            actual_text:"Name:",
            id:"5835ede024a1b174060d123e",
            image_type:"Model_Train",
            prediction_label:[{provider:"google_label", result: "text(94%), logo(86%), font(85%), brand(60%), line(53%), "}],
            prediction_text:[{result: "Name:↵", provider: "google_text"}],
            status:"Model_To_Approve",
            uploaded_on:"2016-12-13T18:55:19.703Z",
            username:"chaitusbwlr@gmail.com",
            object_height:105,
            object_width:244,
            image_dimention:{top_left_x: 332, top_left_y: 71, bottom_right_x: 576, bottom_right_y: 176}
        },
        {
            _id:"5836069724a1b174060d12da",
            actual_label:"Text",
            actual_text:"Age:",
            id:"5836069724a1b174060d12da",
            image_type:"Model_Train",
            prediction_label:[{provider:"google_label", result: "text(94%), logo(86%), font(85%), brand(60%), line(53%), "}],
            prediction_text:[{result: "Age:↵", provider: "google_text"}],
            status:"Model_To_Approve",
            uploaded_on:"2016-12-13T18:55:19.703Z",
            username:"chaitusbwlr@gmail.com",
            object_height:104,
            object_width:244,
            image_dimention:{top_left_x: 332, top_left_y: 71, bottom_right_x: 576, bottom_right_y: 176}
        },
        {
            _id:"583cc08524a1b174060d139d",
            actual_label:"Icon",
            actual_text:"",
            id:"583cc08524a1b174060d139d",
            image_type:"Model_Train",
            prediction_label:[{provider:"google_label", result: "steering part(78%), wheel(75%), automotive exterior(71%), bicycle wheel(68%), steering wheel(65%), spoke(60%), circle(59%), automotive engine part(58%), rings(56%),"}],
            prediction_text:[{result: "", provider: "google_text"}],
            status:"Model_To_Approve",
            uploaded_on:"2016-12-13T18:55:19.703Z",
            username:"chaitusbwlr@gmail.com",
            object_height:232,
            object_width:250,
            image_dimention:{top_left_x: 14, top_left_y: 73, bottom_right_x: 264, bottom_right_y: 305}
        },
        {
            _id:"583cc15324a1b174060d13bb",
            actual_label:"Chart",
            actual_text:"",
            id:"583cc15324a1b174060d13bb",
            image_type:"Model_Train",
            prediction_label:[{provider:"google_label", result: "product(75%), automotive exterior(75%), bicycle frame(68%), furniture(65%), rectangle(51%), "}],
            prediction_text:[{result: "", provider: "google_text"}],
            status:"Model_To_Approve",
            uploaded_on:"2016-12-13T18:55:19.703Z",
            username:"chaitusbwlr@gmail.com",
            object_height:480,
            object_width:548,
            image_dimention:{top_left_x: 698, top_left_y: 497, bottom_right_x: 1246, bottom_right_y: 977}
        }
    ];

    $scope.analyzePrototype = function() {
        sdPrototypePreviewData.setControlData(sampleData);
        window.location.href = "/prototypepreview";
    };
}