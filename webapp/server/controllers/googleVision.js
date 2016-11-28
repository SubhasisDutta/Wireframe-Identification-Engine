/**
 * Created by subhasis on 11/27/16.
 */

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var ImageMetadata = require('../models/ImageMetadata');
const vision = require('node-cloud-vision-api');
vision.init({auth: config.googleVisionKey});

exports.processGoogleVision = function (req,res) {
    var imageId = req.params.id;
    triggerGoogleVisionProcess(imageId);
    res.json({code: 200, message: "Trigger Started Successfully. Please Check for the link after a few minutes."});
};

function triggerGoogleVisionProcess(imageId) {
    var imagePath = config.imageRepo + '/' + imageId + '.png';
    // construct parameters
    const googleAPIRequest = new vision.Request({
        image: new vision.Image(imagePath),
        features: [
            new vision.Feature('TEXT_DETECTION'),
            new vision.Feature('LABEL_DETECTION', 10)
        ]
    });
    // send single request
    vision.annotate(googleAPIRequest).then(function(result) {
        var full_json_response = {
            provider: 'google_full',
            result: JSON.stringify(result)
        };
        var prediction_label = {
            provider: 'google_label',
            result: getLabelFormat(result)
        };
        var prediction_text = {
            provider: 'google_text',
            result: getTextFormat(result)
        };
        ImageMetadata.update({_id: imageId},
            {
                $push: {
                    "full_json_response": full_json_response,
                    "prediction_label": prediction_label,
                    "prediction_text": prediction_text
                }
            }, function (err) {
                if (err) return console.log(err);
            });
    });
}

function getLabelFormat(googleResponse) {
    var result = '';
    var labels = googleResponse.responses[0].labelAnnotations;
    for( var i in labels) {
        result = result + labels[i].description + '(' + Math.round(Number(labels[i].score) * 100) + '%), ';
    }
    return result;
}

function getTextFormat(googleResponse) {
    var result = '';
    var text = googleResponse.responses[0].textAnnotations;
    for (var i in text) {
        var t = text[i].description;
        if (result.indexOf(t) === -1) {
            result = result + t;
        }
    }
    return result;
}

exports.getgoogleFullResponse = function (req, res) {
    ImageMetadata.findOne({_id: req.params.id}).exec(function (err, appData) {
        if (err) {
            res.status(404);
            return res.send({reason: err.toString()});
        }
        var all_response = appData.full_json_response;
        var google_response = null;
        for(var i in all_response) {
            if(all_response[i].provider === 'google_full') {
                google_response = JSON.parse(all_response[i].result);
            }
        }
        res.set('Content-Type', 'application/json');
        res.send(google_response);
    });
};