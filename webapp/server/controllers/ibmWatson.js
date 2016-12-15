/**
 * Created by subhasis on 11/28/16.
 */


var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var ImageMetadata = require('../models/ImageMetadata');
const fs = require('fs');

var watson = require('watson-developer-cloud');


exports.processInIBMWatson = function (req,res) {
    var imageId = req.params.id;
    triggerIBMWatsonVisionProcess(imageId);
    res.json({code: 200, message: "Trigger Started Successfully. Please Check for the link after a few minutes."});
};

function triggerIBMWatsonVisionProcess(imageId) {
    var imagePath = config.imageRepo + '/' + imageId + '.png';

    var visual_recognition = watson.visual_recognition({
        api_key: config.ibmBlumixKey,
        version: 'v3',
        version_date: '2016-05-20'
    });

    var params = {
        images_file: fs.createReadStream(imagePath),
        classifier_ids: config.classifierId,
        owners: ['me'],
        threshold: 0.5
    };
    visual_recognition.classify(params, function(err, result) {
        if (err)
            console.log(err);
        else{
            var full_json_response = {
                provider: 'ibm_full',
                result: JSON.stringify(result)
            };
            var prediction_label = {
                provider: 'ibm_label',
                result: getLabelFormat(result)
            };
            var prediction_text = {
                provider: 'ibm_text',
                result: getTextFormat(result)
            };
            ImageMetadata.update({_id: imageId},
                {
                    $push: {
                        "full_json_response": full_json_response,
                        "prediction_label": prediction_label,
                        "prediction_text": prediction_text
                    },
                    $set: { "uploaded_on" : new Date()}
                }, function (err) {
                    if (err) return console.log(err);
                });
        }
    });

}

function getLabelFormat(response) {
    var result = '';
    var classifiers = response.images[0].classifiers;
    for( var i in classifiers) {
        //result = result + ' | Classifier : ' + classifiers[i].classifier_id + ' --- ';
        for(var j in classifiers[i].classes) {
            result = result + classifiers[i].classes[j].class + '(' + Math.round(Number(classifiers[i].classes[j].score) * 100) + '%), ';
        }
    }
    return result;
}

function getTextFormat(response) {
    var result = '';
    //TODO: Need to see integration with text conversion
    /*var text = response.responses[0].textAnnotations;
    for (var i in text) {
        var t = text[i].description;
        if (result.indexOf(t) === -1) {
            result = result + t;
        }
    }*/
    return result;
}


exports.getWatsonFullResponse = function (req, res) {
    ImageMetadata.findOne({_id: req.params.id}).exec(function (err, appData) {
        if (err) {
            res.status(404);
            return res.send({reason: err.toString()});
        }
        var all_response = appData.full_json_response;
        var google_response = null;
        for(var i in all_response) {
            if(all_response[i].provider === 'ibm_full') {
                google_response = JSON.parse(all_response[i].result);
            }
        }
        res.set('Content-Type', 'application/json');
        res.send(google_response);
    });
};