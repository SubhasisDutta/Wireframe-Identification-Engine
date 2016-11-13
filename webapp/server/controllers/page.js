/**
 * Created by subhasis on 11/1/16.
 */
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var ImageMetadata = require('../models/ImageMetadata');
var wireframeMetadata = require('../models/WireframeMetadata');
const fs = require('fs');

exports.getPageById = function(req, res) {
    wireframeMetadata.findOne({_id: req.params.id}).exec(function (err, appData) {
        if (err) {
            res.status(404);
            return res.send({reason: err.toString()});
        }
        var imageIDs = [];
        for(var i in appData.controls) {
            imageIDs.push(appData.controls[i].controlImageId);
        }
        ImageMetadata.find()
            .where('_id')
            .in(imageIDs)
            .exec(function (err, records) {
                var responceObj = {
                    _id: appData._id,
                    title: appData.title,
                    wireframeImageId: appData.wireframeImageId,
                    uploaded_on: appData.uploaded_on,
                    username: appData.username,
                    wireframe_width: appData.wireframe_width,
                    wireframe_height: appData.wireframe_height,
                    acessType: appData.acessType,
                    controls: records
                };
                res.send(responceObj);
            });

    });
};

exports.getImageById = function(req, res) {
    var fileName = req.params.id + '.png';
    var options = {
        root: config.imageRepo
    };
    res.sendfile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
};

exports.removeWireframe = function(req, res) {
    var imageID = req.body.controlImageId;
    var fileIDs = [];
    wireframeMetadata.findOne({_id: req.params.id}).exec(function (err, appData) {
        if (err) {
            res.status(404);
            return res.send({reason: err.toString()});
        }
        fileIDs.push(appData.wireframeImageId);
        for(var i in appData.controls) {
            fileIDs.push(appData.controls[i].controlImageId);
        }
        wireframeMetadata.remove({ _id: req.params.id }, function(err) {
            if (err) {
                return res.json({code: 510, message: "Error in removing record from wireframeMetadata"});
            }
            ImageMetadata.remove({ _id: { $in: fileIDs } }, function (err) {
                if (err) {
                    return res.json({code: 510, message: "Error in removing record from ImageMetadata"});
                }
                for(var i in fileIDs) {
                    if(fileIDs[i]) {
                        var file_name = config.imageRepo + '/' + fileIDs[i] + '.png';
                        fs.unlink(file_name);
                    }
                }
                res.json({code: 200, message: "Wireframe Removed"});
            });
        });
    });
};