/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdProcessAnnotateCtrl;

function sdProcessAnnotateCtrl($scope, $location, Upload, sdNotifier, $routeParams, $resource, sdPrototypePreviewData, $timeout) {

    $scope.cropper = {};
    $scope.cropper.sourceImage = null;
    $scope.cropper.croppedImage = null;
    $scope.bounds = {};
    $scope.bounds.left = 0;
    $scope.bounds.right = 200;
    $scope.bounds.top = 0;
    $scope.bounds.bottom = 200;
    $scope.wireframeData = {};
    var wmRes = $resource("/api/page/detail/:_id");
    wmRes.get({_id: $routeParams.id}, function (response) {

        for(var i in response.controls) {
            var doc = response.controls[i];
            doc.googleAvailable = false;
            doc.prediction_text_google = '';
            doc.prediction_label_google = '';
            for(var j in doc.prediction_text) {
                if(doc.prediction_text[j].provider === 'google_text'){
                    doc.googleAvailable = true;
                    doc.prediction_text_google = doc.prediction_text[j].result;
                }
                if(doc.prediction_label[j].provider === 'google_label') {
                    doc.prediction_label_google = doc.prediction_label[j].result;
                }
            }
            doc.ibmWatsonAvailable = false;
            doc.prediction_text_ibm = '';
            doc.prediction_label_ibm = '';
            for(var j in doc.prediction_text) {
                if(doc.prediction_text[j].provider === 'ibm_text'){
                    doc.prediction_text_ibm = doc.prediction_text[j].result;
                }
                if(doc.prediction_label[j].provider === 'ibm_label') {
                    doc.ibmWatsonAvailable = true;
                    doc.prediction_label_ibm = doc.prediction_label[j].result;
                }
            }
        }

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
        printResponse($scope.wireframeMetadata);
    });



    function printResponse(metaDataList) {
        $scope.metadataFormatted = JSON.stringify(metaDataList, null, "    ");
        console.log($scope.metadataFormatted);
    }



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

    $scope.analyzeAllControls = function () {
        // wmRes.get({_id: $routeParams.id}, function (response) {
            // var controlMetadata = response;
            // try {
            //     controlMetadata.controls.forEach(function (control) {
            //         $scope.analyzeGoogleVision(control._id);
            //         $scope.analyzeIBMWatson(control._id);
            //     });
            // } catch (e) {
            //     console.log(e);
            // }
            // sdPrototypePreviewData.setControlData($scope.wireframeMetadata);
            sdPrototypePreviewData.setControlData(sampleData);
            $location.path('/prototypepreview');
        // });
    };

    $scope.analyzeGoogleVision = function(imageId) {
        var analyzeGoogleVision = new $resource('/api/analyze/googlevision/:_id',
            {_id: imageId},
            {'update': {method: 'PUT'}});
        analyzeGoogleVision.update().$promise.then(function(response) {
            sdNotifier.notify(response.message);
            window.location.reload();
        }).catch(function(response) {
            console.log(response);
        });
    };

    $scope.analyzeIBMWatson = function(imageId) {
        console.log(imageId);
        var analyzeIBMWatson = new $resource('/api/analyze/ibmimageanalyze/:_id',
            {_id: imageId},
            {'update': {method: 'PUT'}});
        analyzeIBMWatson.update().$promise.then(function(response) {
            sdNotifier.notify(response.message);
            window.location.reload();
        }).catch(function(response) {
            console.log(response);
        });
    };

    var sampleData = {"_id":"58768be92d9cad0c60769c79","title":"Wireframe by Rithvik Lagisetti","wireframeImageId":"58768be92d9cad0c60769c78","uploaded_on":"2017-01-11T19:47:53.985Z","username":"rithvik.lagisetti@sap.com","wireframe_width":480,"wireframe_height":610,"acessType":"Public","controls":[{"_id":"58768c1d2d9cad0c60769c7a","uploaded_on":"2017-01-11T19:50:07.073Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":5,"top_left_y":18,"bottom_right_x":92,"bottom_right_y":111},"object_width":87,"object_height":93,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/0h8lskq\",\"description\":\"steering part\",\"score\":0.8052479},{\"mid\":\"/m/01bqk0\",\"description\":\"bicycle wheel\",\"score\":0.78838044},{\"mid\":\"/m/083wq\",\"description\":\"wheel\",\"score\":0.74949259},{\"mid\":\"/m/0h8ls87\",\"description\":\"automotive exterior\",\"score\":0.69650978},{\"mid\":\"/m/0h8lsgn\",\"description\":\"automotive engine part\",\"score\":0.67173451},{\"mid\":\"/m/0h8kxbv\",\"description\":\"body jewelry\",\"score\":0.62013125},{\"mid\":\"/m/0h8mx54\",\"description\":\"outdoor power equipment\",\"score\":0.5376513},{\"mid\":\"/m/03b6_4\",\"description\":\"steering wheel\",\"score\":0.52757531},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.51497322}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"icon\",\"score\":0.948544},{\"class\":\"image\",\"score\":0.740551}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"58768c1d2d9cad0c60769c7a.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"steering part(81%), bicycle wheel(79%), wheel(75%), automotive exterior(70%), automotive engine part(67%), body jewelry(62%), outdoor power equipment(54%), steering wheel(53%), line(51%), ","provider":"google_label"},{"result":"icon(95%), image(74%), ","provider":"ibm_label"}]},{"_id":"58768c312d9cad0c60769c7c","uploaded_on":"2017-01-11T19:50:08.355Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":169,"top_left_y":19,"bottom_right_x":267,"bottom_right_y":68},"object_width":98,"object_height":49,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/07s6nbt\",\"description\":\"text\",\"score\":0.90919},{\"mid\":\"/m/0dwx7\",\"description\":\"logo\",\"score\":0.89088583},{\"mid\":\"/m/03gq5hm\",\"description\":\"font\",\"score\":0.82953137},{\"mid\":\"/m/01jwgf\",\"description\":\"product\",\"score\":0.73632771},{\"mid\":\"/m/01cd9\",\"description\":\"brand\",\"score\":0.59691668},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.51136649}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"Name\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":6,\"y\":9},{\"x\":87,\"y\":9},{\"x\":87,\"y\":38},{\"x\":6,\"y\":38}]}},{\"description\":\"Name\",\"boundingPoly\":{\"vertices\":[{\"x\":6,\"y\":9},{\"x\":87,\"y\":9},{\"x\":87,\"y\":38},{\"x\":6,\"y\":38}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"text\",\"score\":0.6174}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"58768c312d9cad0c60769c7c.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"Name\n","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"text(91%), logo(89%), font(83%), product(74%), brand(60%), line(51%), ","provider":"google_label"},{"result":"text(62%), ","provider":"ibm_label"}]},{"_id":"58768c352d9cad0c60769c7e","uploaded_on":"2017-01-11T19:50:09.902Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":298,"top_left_y":15,"bottom_right_x":395,"bottom_right_y":64},"object_width":97,"object_height":49,"__v":0,"tags":[],"full_json_response":[{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"text\",\"score\":0.616625}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"58768c352d9cad0c60769c7e.png\"}],\"images_processed\":1}","provider":"ibm_full"},{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/0dwx7\",\"description\":\"logo\",\"score\":0.84220123},{\"mid\":\"/m/03gq5hm\",\"description\":\"font\",\"score\":0.83778232},{\"mid\":\"/m/01cd9\",\"description\":\"brand\",\"score\":0.59691668},{\"mid\":\"/m/0dgsmq8\",\"description\":\"artwork\",\"score\":0.543067},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.50714713}],\"textAnnotations\":[{\"locale\":\"gd\",\"description\":\"Peter\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":7,\"y\":4},{\"x\":87,\"y\":4},{\"x\":87,\"y\":39},{\"x\":7,\"y\":39}]}},{\"description\":\"Peter\",\"boundingPoly\":{\"vertices\":[{\"x\":7,\"y\":4},{\"x\":87,\"y\":4},{\"x\":87,\"y\":39},{\"x\":7,\"y\":39}]}}]}]}","provider":"google_full"}],"prediction_text":[{"result":"","provider":"ibm_text"},{"result":"Peter\n","provider":"google_text"}],"prediction_label":[{"result":"text(62%), ","provider":"ibm_label"},{"result":"logo(84%), font(84%), brand(60%), artwork(54%), line(51%), ","provider":"google_label"}]},{"_id":"58768c3d2d9cad0c60769c80","uploaded_on":"2017-01-11T19:50:15.312Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":188,"top_left_y":80,"bottom_right_x":264,"bottom_right_y":134},"object_width":76,"object_height":54,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/0dwx7\",\"description\":\"logo\",\"score\":0.81993628},{\"mid\":\"/m/03gq5hm\",\"description\":\"font\",\"score\":0.77917171},{\"mid\":\"/m/01jwgf\",\"description\":\"product\",\"score\":0.70583218},{\"mid\":\"/m/0h8ls87\",\"description\":\"automotive exterior\",\"score\":0.69244009},{\"mid\":\"/m/0h8kxbv\",\"description\":\"body jewelry\",\"score\":0.62013394},{\"mid\":\"/m/01cd9\",\"description\":\"brand\",\"score\":0.59691668},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.542252}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"Age\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":10,\"y\":9},{\"x\":60,\"y\":9},{\"x\":60,\"y\":50},{\"x\":10,\"y\":50}]}},{\"description\":\"Age\",\"boundingPoly\":{\"vertices\":[{\"x\":10,\"y\":9},{\"x\":60,\"y\":9},{\"x\":60,\"y\":50},{\"x\":10,\"y\":50}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"text\",\"score\":0.612005}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"58768c3d2d9cad0c60769c80.png\"}],\"images_processed\":1}","provider":"ibm_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"text\",\"score\":0.612005}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"58768c3d2d9cad0c60769c80.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"Age\n","provider":"google_text"},{"result":"","provider":"ibm_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"logo(82%), font(78%), product(71%), automotive exterior(69%), body jewelry(62%), brand(60%), line(54%), ","provider":"google_label"},{"result":"text(61%), ","provider":"ibm_label"},{"result":"text(61%), ","provider":"ibm_label"}]},{"_id":"58768c432d9cad0c60769c82","uploaded_on":"2017-01-11T19:50:16.544Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":302,"top_left_y":76,"bottom_right_x":374,"bottom_right_y":128},"object_width":72,"object_height":52,"__v":0,"tags":[],"full_json_response":[{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"text\",\"score\":0.527855}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"58768c432d9cad0c60769c82.png\"}],\"images_processed\":1}","provider":"ibm_full"},{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/03gq5hm\",\"description\":\"font\",\"score\":0.79635459},{\"mid\":\"/m/0h8ls87\",\"description\":\"automotive exterior\",\"score\":0.75236726},{\"mid\":\"/m/0h8kxbv\",\"description\":\"body jewelry\",\"score\":0.62012833}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"2 T\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":11,\"y\":11},{\"x\":54,\"y\":11},{\"x\":54,\"y\":42},{\"x\":11,\"y\":42}]}},{\"description\":\"2\",\"boundingPoly\":{\"vertices\":[{\"x\":12,\"y\":11},{\"x\":30,\"y\":11},{\"x\":30,\"y\":42},{\"x\":12,\"y\":42}]}},{\"description\":\"T\",\"boundingPoly\":{\"vertices\":[{\"x\":43,\"y\":11},{\"x\":55,\"y\":11},{\"x\":55,\"y\":42},{\"x\":43,\"y\":42}]}}]}]}","provider":"google_full"}],"prediction_text":[{"result":"","provider":"ibm_text"},{"result":"2 T\n","provider":"google_text"}],"prediction_label":[{"result":"text(53%), ","provider":"ibm_label"},{"result":"font(80%), automotive exterior(75%), body jewelry(62%), ","provider":"google_label"}]},{"_id":"58768c4b2d9cad0c60769c84","uploaded_on":"2017-01-11T19:50:25.345Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":12,"top_left_y":185,"bottom_right_x":357,"bottom_right_y":355},"object_width":345,"object_height":170,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/07s6nbt\",\"description\":\"text\",\"score\":0.92060792},{\"mid\":\"/m/03gq5hm\",\"description\":\"font\",\"score\":0.77698547},{\"mid\":\"/m/01jwgf\",\"description\":\"product\",\"score\":0.71433413},{\"mid\":\"/m/01cd9\",\"description\":\"brand\",\"score\":0.59691668},{\"mid\":\"/m/0c_jw\",\"description\":\"furniture\",\"score\":0.55086309},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.54443133},{\"mid\":\"/m/02csf\",\"description\":\"drawing\",\"score\":0.52549523},{\"mid\":\"/m/05c0n6k\",\"description\":\"label\",\"score\":0.51678795}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"Date Sports Reps\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":13,\"y\":22},{\"x\":307,\"y\":22},{\"x\":307,\"y\":53},{\"x\":13,\"y\":53}]}},{\"description\":\"Date\",\"boundingPoly\":{\"vertices\":[{\"x\":13,\"y\":22},{\"x\":76,\"y\":22},{\"x\":76,\"y\":53},{\"x\":13,\"y\":53}]}},{\"description\":\"Sports\",\"boundingPoly\":{\"vertices\":[{\"x\":117,\"y\":22},{\"x\":190,\"y\":22},{\"x\":190,\"y\":53},{\"x\":117,\"y\":53}]}},{\"description\":\"Reps\",\"boundingPoly\":{\"vertices\":[{\"x\":255,\"y\":22},{\"x\":307,\"y\":22},{\"x\":307,\"y\":53},{\"x\":255,\"y\":53}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"table\",\"score\":0.999553}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"58768c4b2d9cad0c60769c84.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"Date Sports Reps\n","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"text(92%), font(78%), product(71%), brand(60%), furniture(55%), line(54%), drawing(53%), label(52%), ","provider":"google_label"},{"result":"table(100%), ","provider":"ibm_label"}]},{"_id":"58768c582d9cad0c60769c86","uploaded_on":"2017-01-11T19:50:26.617Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":14,"top_left_y":395,"bottom_right_x":322,"bottom_right_y":602},"object_width":308,"object_height":207,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/0f1tz\",\"description\":\"calligraphy\",\"score\":0.80124664},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.71406555},{\"mid\":\"/m/0jjw\",\"description\":\"art\",\"score\":0.65959585},{\"mid\":\"/m/02csf\",\"description\":\"drawing\",\"score\":0.58203959},{\"mid\":\"/m/016nqd\",\"description\":\"shape\",\"score\":0.58017409},{\"mid\":\"/m/01g3x7\",\"description\":\"bow and arrow\",\"score\":0.56566006}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"chart\",\"score\":0.996204}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"58768c582d9cad0c60769c86.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"calligraphy(80%), line(71%), art(66%), drawing(58%), shape(58%), bow and arrow(57%), ","provider":"google_label"},{"result":"chart(100%), ","provider":"ibm_label"}]}]};

    $scope.analyzePrototype = function() {
        sdPrototypePreviewData.setControlData(sampleData);
        $location.path('/prototypepreview');
    };
}