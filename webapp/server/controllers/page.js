/**
 * Created by subhasis on 11/1/16.
 */
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var ImageMetadata = require('../models/ImageMetadata');
var wireframeMetadata = require('../models/WireframeMetadata');
const fs = require('fs');
var fsex = require('fs-extra');
var json2csv = require('json2csv');
var zipFolder = require('zip-folder');

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
                    controls: records,
                    dropPacketUrl: appData.dropPacketUrl,
                    dropPacked_created_on: appData.dropPacked_created_on
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

exports.createZip = function (req, res) {
    triggerZipCreation(req.params.id);
    res.json({code: 200, message: "Trigger Started Successfully. Please Check for the link in the View Page after a few minutes."});
};

function triggerZipCreation(wireframeId) {
    wireframeMetadata.findOne({_id: wireframeId}).exec(function (err, appData) {
        if (err) {
            res.status(404);
            return res.send({reason: err.toString()});
        }
        //Create an array of all the images ID's to be copied in the zip
        var imageCopyArray = [];
        imageCopyArray.push(appData.wireframeImageId);
        for(var i in appData.controls) {
            if(appData.controls[i].controlImageId) {
                imageCopyArray.push(appData.controls[i].controlImageId);
            }
        }
        var copyFolderPath = config.tempDirectory + '/' +wireframeId;
        fsex.mkdirs(copyFolderPath, function(err) {
            if (err) return console.error(err);
            //start creating the CSV file and save it in this location
            ImageMetadata.find()
                .where('_id')
                .in(imageCopyArray)
                .exec(function (err, records) {
                    var csv_fields = ['_id', 'image_type',
                        'object_width', 'object_height', 'uploaded_on', 'username',
                        'image_dimention.top_left_x', 'image_dimention.top_left_y',
                        'image_dimention.bottom_right_x', 'image_dimention.bottom_right_y'];
                    var csv = json2csv({ data: records, fields: csv_fields });
                    fs.writeFile(copyFolderPath + '/image_metadata.csv', csv, function(err) {
                        if (err) throw err;
                        console.log(copyFolderPath + '/image_metadata.csv' +' file saved');
                        //Copy all images with id in imageCopyArray
                        copyAllImagesAndProcess(copyFolderPath, imageCopyArray);
                    });
                });
        });
    });
}

function copyAllImagesAndProcess(copyFolderPath, imageCopyArray) {
    var copyStatus = [];
    for(var i in imageCopyArray) {
        copyStatus[i] = false;
    }
    for (var i in imageCopyArray) {
        var sourceFile = config.imageRepo + '/' + imageCopyArray[i] + '.png';
        var targetFile = copyFolderPath + '/' + imageCopyArray[i] + '.png';
        fsex.copy(sourceFile, targetFile, function (err) {
            if (err) return console.error(err);
            copyStatus[i] = true;
        });
    }
    //wait for some time then zip
    setTimeout(function() {
        var wireframeID= copyFolderPath.split('/').pop();
        var targetZip = config.tempDirectory + '/' + wireframeID + '.zip';
        zipFolder(copyFolderPath,  targetZip, function(err) {
            if(err) {
                console.log('Zip Creation failed.', err);
            } else {
                console.log('Zip Creation Done.');
                //upload the zip to s3
                uploadFileToS3(targetZip, wireframeID);
            }
        });
    },3000);
}

var AWS = require('aws-sdk');

// For dev purposes only
AWS.config.update({ accessKeyId: config.awsAcessKey, secretAccessKey: config.awssec });
var s3 = new AWS.S3();

function uploadFileToS3(targetZip, wireframeID) {
    fs.readFile(targetZip, function (err, data) {
        if (err) { throw err; }
        var params = {Bucket: config.awsBucket, Key: wireframeID + '.zip', Body: data};
        s3.putObject(params, function(err, data) {
            if (err)
                console.log(err);
            else {
                console.log("Successfully uploaded data to wie-zip/" + wireframeID);
                //delete folder and zip
                fsex.remove(targetZip, function (err) {
                    if (err) return console.error(err);
                    console.log('Zip Deleated.');
                });
                var folderName = targetZip.substring(0, targetZip.length - 4);
                fsex.remove(folderName, function (err) {
                    if (err) return console.error(err);
                    console.log('Folder Deleated.');
                });
                var url = config.s3Url + '/' + config.awsBucket + '/' +wireframeID + '.zip';
                updateWireframeURLRecord(wireframeID,url);
            }
        });
    });
}

function updateWireframeURLRecord(wireframeID,url) {
    wireframeMetadata.findByIdAndUpdate(
        wireframeID,
        {$set: {"dropPacketUrl": url,"dropPacked_created_on": new Date()}},
        {safe: true, new : true},
        function(err, model) {
            if (err) {
                console.log(err);
            }
            console.log('Wireframe Drop Packed Created for ' + wireframeID);
        }
    );
}