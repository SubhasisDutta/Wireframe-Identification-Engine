/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdProcessAnnotateCtrl;

function sdProcessAnnotateCtrl($scope, $location, Upload, sdNotifier, $routeParams, $resource, sdPrototypePreviewData) {

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

    var sampleData = {"_id":"586ec44a2d9cad0c60769c65","title":"Final for testing by Rithvik Lagisetti","wireframeImageId":"586ec44a2d9cad0c60769c64","uploaded_on":"2017-01-05T22:10:18.500Z","username":"rithvik.lagisetti@sap.com","wireframe_width":480,"wireframe_height":492,"acessType":"Public","controls":[{"_id":"586ec4612d9cad0c60769c66","uploaded_on":"2017-01-05T22:13:12.044Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":59,"top_left_y":42,"bottom_right_x":148,"bottom_right_y":143},"object_width":89,"object_height":101,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/0h8ls87\",\"description\":\"automotive exterior\",\"score\":0.73863256},{\"mid\":\"/m/0h8lsgn\",\"description\":\"automotive engine part\",\"score\":0.73845041},{\"mid\":\"/m/0h8kxbv\",\"description\":\"body jewelry\",\"score\":0.620117},{\"mid\":\"/m/01bqk0\",\"description\":\"bicycle wheel\",\"score\":0.61542714},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.57806581},{\"mid\":\"/m/0h8lskq\",\"description\":\"steering part\",\"score\":0.5750702},{\"mid\":\"/m/08dz3q\",\"description\":\"auto part\",\"score\":0.50005323}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"Do\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":22,\"y\":18},{\"x\":65,\"y\":18},{\"x\":65,\"y\":84},{\"x\":22,\"y\":84}]}},{\"description\":\"Do\",\"boundingPoly\":{\"vertices\":[{\"x\":25,\"y\":85},{\"x\":22,\"y\":21},{\"x\":62,\"y\":19},{\"x\":65,\"y\":83}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"icon\",\"score\":0.951144}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"586ec4612d9cad0c60769c66.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"Do\n","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"automotive exterior(74%), automotive engine part(74%), body jewelry(62%), bicycle wheel(62%), line(58%), steering part(58%), auto part(50%), ","provider":"google_label"},{"result":"icon(95%), ","provider":"ibm_label"}]},{"_id":"586ec46c2d9cad0c60769c68","uploaded_on":"2017-01-05T22:13:15.835Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":199,"top_left_y":45,"bottom_right_x":277,"bottom_right_y":83},"object_width":78,"object_height":38,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/07s6nbt\",\"description\":\"text\",\"score\":0.92277092},{\"mid\":\"/m/03gq5hm\",\"description\":\"font\",\"score\":0.85645008},{\"mid\":\"/m/0dwx7\",\"description\":\"logo\",\"score\":0.78938305},{\"mid\":\"/m/01jwgf\",\"description\":\"product\",\"score\":0.71815819},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.604453},{\"mid\":\"/m/01cd9\",\"description\":\"brand\",\"score\":0.59691668}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"Name\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":2,\"y\":7},{\"x\":58,\"y\":7},{\"x\":58,\"y\":31},{\"x\":2,\"y\":31}]}},{\"description\":\"Name\",\"boundingPoly\":{\"vertices\":[{\"x\":2,\"y\":7},{\"x\":58,\"y\":7},{\"x\":58,\"y\":31},{\"x\":2,\"y\":31}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"text\",\"score\":0.642009}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"586ec46c2d9cad0c60769c68.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"Name\n","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"text(92%), font(86%), logo(79%), product(72%), line(60%), brand(60%), ","provider":"google_label"},{"result":"text(64%), ","provider":"ibm_label"}]},{"_id":"586ec4722d9cad0c60769c6a","uploaded_on":"2017-01-05T22:13:16.760Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":197,"top_left_y":93,"bottom_right_x":275,"bottom_right_y":137},"object_width":78,"object_height":44,"__v":0,"tags":[],"full_json_response":[{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"text\",\"score\":0.666216}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"586ec4722d9cad0c60769c6a.png\"}],\"images_processed\":1}","provider":"ibm_full"},{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/03gq5hm\",\"description\":\"font\",\"score\":0.83058876},{\"mid\":\"/m/0dwx7\",\"description\":\"logo\",\"score\":0.79487371},{\"mid\":\"/m/01jwgf\",\"description\":\"product\",\"score\":0.72097278},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.61386859},{\"mid\":\"/m/01cd9\",\"description\":\"brand\",\"score\":0.59691668}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"Age\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":12,\"y\":3},{\"x\":52,\"y\":3},{\"x\":52,\"y\":39},{\"x\":12,\"y\":39}]}},{\"description\":\"Age\",\"boundingPoly\":{\"vertices\":[{\"x\":12,\"y\":3},{\"x\":52,\"y\":3},{\"x\":52,\"y\":39},{\"x\":12,\"y\":39}]}}]}]}","provider":"google_full"}],"prediction_text":[{"result":"","provider":"ibm_text"},{"result":"Age\n","provider":"google_text"}],"prediction_label":[{"result":"text(67%), ","provider":"ibm_label"},{"result":"font(83%), logo(79%), product(72%), line(61%), brand(60%), ","provider":"google_label"}]},{"_id":"586ec4782d9cad0c60769c6c","uploaded_on":"2017-01-05T22:13:29.667Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":278,"top_left_y":46,"bottom_right_x":338,"bottom_right_y":80},"object_width":60,"object_height":34,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/07s6nbt\",\"description\":\"text\",\"score\":0.91563082},{\"mid\":\"/m/03gq5hm\",\"description\":\"font\",\"score\":0.82155544},{\"mid\":\"/m/0dwx7\",\"description\":\"logo\",\"score\":0.7693134},{\"mid\":\"/m/01cd9\",\"description\":\"brand\",\"score\":0.59691668},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.52285141}],\"textAnnotations\":[{\"locale\":\"gd\",\"description\":\"Peter\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":1,\"y\":2},{\"x\":58,\"y\":2},{\"x\":58,\"y\":32},{\"x\":1,\"y\":32}]}},{\"description\":\"Peter\",\"boundingPoly\":{\"vertices\":[{\"x\":3,\"y\":2},{\"x\":58,\"y\":5},{\"x\":56,\"y\":32},{\"x\":1,\"y\":29}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"text\",\"score\":0.668864}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"586ec4782d9cad0c60769c6c.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"Peter\n","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"text(92%), font(82%), logo(77%), brand(60%), line(52%), ","provider":"google_label"},{"result":"text(67%), ","provider":"ibm_label"}]},{"_id":"586ec47d2d9cad0c60769c6e","uploaded_on":"2017-01-05T22:13:31.631Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":276,"top_left_y":93,"bottom_right_x":311,"bottom_right_y":127},"object_width":35,"object_height":34,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/01jwgf\",\"description\":\"product\",\"score\":0.73283011}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"21\\n21\\n\",\"boundingPoly\":{\"vertices\":[{\"y\":5},{\"x\":24,\"y\":5},{\"x\":24,\"y\":27},{\"y\":27}]}},{\"description\":\"21\",\"boundingPoly\":{\"vertices\":[{\"x\":2,\"y\":5},{\"x\":24,\"y\":5},{\"x\":24,\"y\":27},{\"x\":2,\"y\":27}]}},{\"description\":\"21\",\"boundingPoly\":{\"vertices\":[{\"y\":6},{\"x\":23,\"y\":6},{\"x\":23,\"y\":27},{\"y\":27}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"text\",\"score\":0.512905}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"586ec47d2d9cad0c60769c6e.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"21\n21\n","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"product(73%), ","provider":"google_label"},{"result":"text(51%), ","provider":"ibm_label"}]},{"_id":"586ec4832d9cad0c60769c70","uploaded_on":"2017-01-05T22:13:38.037Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":339,"top_left_y":6,"bottom_right_x":431,"bottom_right_y":48},"object_width":92,"object_height":42,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/0h8ls87\",\"description\":\"automotive exterior\",\"score\":0.76050526},{\"mid\":\"/m/01jwgf\",\"description\":\"product\",\"score\":0.72593117},{\"mid\":\"/m/01jfm_\",\"description\":\"vehicle registration plate\",\"score\":0.68009645},{\"mid\":\"/m/0dwx7\",\"description\":\"logo\",\"score\":0.51711828}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"EDIT\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":17,\"y\":10},{\"x\":76,\"y\":10},{\"x\":76,\"y\":30},{\"x\":17,\"y\":30}]}},{\"description\":\"EDIT\",\"boundingPoly\":{\"vertices\":[{\"x\":17,\"y\":10},{\"x\":76,\"y\":10},{\"x\":76,\"y\":30},{\"x\":17,\"y\":30}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"button\",\"score\":0.997265}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"586ec4832d9cad0c60769c70.png\"}],\"images_processed\":1}","provider":"ibm_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"button\",\"score\":0.997265}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"586ec4832d9cad0c60769c70.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"EDIT\n","provider":"google_text"},{"result":"","provider":"ibm_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"automotive exterior(76%), product(73%), vehicle registration plate(68%), logo(52%), ","provider":"google_label"},{"result":"button(100%), ","provider":"ibm_label"},{"result":"button(100%), ","provider":"ibm_label"}]},{"_id":"586ec4a32d9cad0c60769c72","uploaded_on":"2017-01-05T22:13:49.332Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":11,"top_left_y":198,"bottom_right_x":256,"bottom_right_y":374},"object_width":245,"object_height":176,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/03gq5hm\",\"description\":\"font\",\"score\":0.76289505},{\"mid\":\"/m/0h8ls87\",\"description\":\"automotive exterior\",\"score\":0.73763013},{\"mid\":\"/m/01jwgf\",\"description\":\"product\",\"score\":0.703519},{\"mid\":\"/m/0c_jw\",\"description\":\"furniture\",\"score\":0.57618439},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.54883248},{\"mid\":\"/m/01c34b\",\"description\":\"flooring\",\"score\":0.50446427}],\"textAnnotations\":[{\"locale\":\"af\",\"description\":\"Date Time Sport\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":20,\"y\":19},{\"x\":220,\"y\":19},{\"x\":220,\"y\":53},{\"x\":20,\"y\":53}]}},{\"description\":\"Date\",\"boundingPoly\":{\"vertices\":[{\"x\":20,\"y\":23},{\"x\":73,\"y\":22},{\"x\":74,\"y\":52},{\"x\":21,\"y\":53}]}},{\"description\":\"Time\",\"boundingPoly\":{\"vertices\":[{\"x\":91,\"y\":21},{\"x\":145,\"y\":20},{\"x\":146,\"y\":50},{\"x\":92,\"y\":51}]}},{\"description\":\"Sport\",\"boundingPoly\":{\"vertices\":[{\"x\":164,\"y\":20},{\"x\":219,\"y\":19},{\"x\":220,\"y\":49},{\"x\":165,\"y\":50}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"table\",\"score\":0.999554}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"586ec4a32d9cad0c60769c72.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"Date Time Sport\n","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"font(76%), automotive exterior(74%), product(70%), furniture(58%), line(55%), flooring(50%), ","provider":"google_label"},{"result":"table(100%), ","provider":"ibm_label"}]},{"_id":"586ec4af2d9cad0c60769c74","uploaded_on":"2017-01-05T22:14:01.628Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":291,"top_left_y":200,"bottom_right_x":454,"bottom_right_y":375},"object_width":163,"object_height":175,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/03gq5hm\",\"description\":\"font\",\"score\":0.77223253},{\"mid\":\"/m/0f1tz\",\"description\":\"calligraphy\",\"score\":0.7184096},{\"mid\":\"/m/03scnj\",\"description\":\"line\",\"score\":0.69073844},{\"mid\":\"/m/0dwx7\",\"description\":\"logo\",\"score\":0.61772108},{\"mid\":\"/m/01cd9\",\"description\":\"brand\",\"score\":0.59691668},{\"mid\":\"/m/081rb\",\"description\":\"writing\",\"score\":0.593206},{\"mid\":\"/m/02csf\",\"description\":\"drawing\",\"score\":0.5647704},{\"mid\":\"/m/0dgsmq8\",\"description\":\"artwork\",\"score\":0.53323966}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"7\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":29,\"y\":100},{\"x\":55,\"y\":100},{\"x\":55,\"y\":126},{\"x\":29,\"y\":126}]}},{\"description\":\"7\",\"boundingPoly\":{\"vertices\":[{\"x\":56,\"y\":101},{\"x\":55,\"y\":126},{\"x\":30,\"y\":125},{\"x\":31,\"y\":100}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"chart\",\"score\":0.996183}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"586ec4af2d9cad0c60769c74.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"7\n","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"font(77%), calligraphy(72%), line(69%), logo(62%), brand(60%), writing(59%), drawing(56%), artwork(53%), ","provider":"google_label"},{"result":"chart(100%), ","provider":"ibm_label"}]},{"_id":"586ec4b72d9cad0c60769c76","uploaded_on":"2017-01-05T22:14:03.247Z","username":"rithvik.lagisetti@sap.com","image_type":"Wireframe_Control","status":"Control_Not_Processed","image_dimention":{"top_left_x":174,"top_left_y":410,"bottom_right_x":291,"bottom_right_y":473},"object_width":117,"object_height":63,"__v":0,"tags":[],"full_json_response":[{"result":"{\"responses\":[{\"labelAnnotations\":[{\"mid\":\"/m/0h8ls87\",\"description\":\"automotive exterior\",\"score\":0.75888169},{\"mid\":\"/m/01jfm_\",\"description\":\"vehicle registration plate\",\"score\":0.70511657}],\"textAnnotations\":[{\"locale\":\"en\",\"description\":\"SUBMIT\\n\",\"boundingPoly\":{\"vertices\":[{\"x\":18,\"y\":18},{\"x\":104,\"y\":18},{\"x\":104,\"y\":44},{\"x\":18,\"y\":44}]}},{\"description\":\"SUBMIT\",\"boundingPoly\":{\"vertices\":[{\"x\":18,\"y\":18},{\"x\":104,\"y\":18},{\"x\":104,\"y\":44},{\"x\":18,\"y\":44}]}}]}]}","provider":"google_full"},{"result":"{\"custom_classes\":6,\"images\":[{\"classifiers\":[{\"classes\":[{\"class\":\"button\",\"score\":0.996995},{\"class\":\"table\",\"score\":0.785889}],\"classifier_id\":\"buildControl2_241225298\",\"name\":\"buildControl2\"}],\"image\":\"586ec4b72d9cad0c60769c76.png\"}],\"images_processed\":1}","provider":"ibm_full"}],"prediction_text":[{"result":"SUBMIT\n","provider":"google_text"},{"result":"","provider":"ibm_text"}],"prediction_label":[{"result":"automotive exterior(76%), vehicle registration plate(71%), ","provider":"google_label"},{"result":"button(100%), table(79%), ","provider":"ibm_label"}]}]};

    $scope.analyzePrototype = function() {
        sdPrototypePreviewData.setControlData(sampleData);
        $location.path('/prototypepreview');
    };
}