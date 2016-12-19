/**
 * Created by subhasis on 11/1/16.
 */
'use strict';

module.exports = sdPageDetailCtrl;

function sdPageDetailCtrl ($scope, $routeParams, $resource, $timeout, sdNotifier) {
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
    });

    $scope.analyzeGoogleVision = function(imageId) {
        var analyzeGoogleVision = new $resource('/api/analyze/googlevision/:_id',
            {_id: imageId},
            {'update': {method: 'PUT'}});
        analyzeGoogleVision.update().$promise.then(function(response) {
            sdNotifier.notify(response.message);
            $timeout(function(){
                window.location.reload();
            }, 6000);
        });
    };

    $scope.analyzeIBMWatson = function(imageId) {
        var analyzeIBMWatson = new $resource('/api/analyze/ibmimageanalyze/:_id',
            {_id: imageId},
            {'update': {method: 'PUT'}});
        analyzeIBMWatson.update().$promise.then(function(response) {
            sdNotifier.notify(response.message);
            $timeout(function(){
                window.location.reload();
            }, 6000);
        });
    };
}