/**
 * Created by subhasis on 11/1/16.
 */
var multer = require('multer');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var ImageMetadata = require('../models/ImageMetadata');
var TestDataDownloadLog = require('../models/TestDataDownloadLog');
const fs = require('fs');


exports.uploadCropedImage = function (req, res) {
    var currentUser = req.user;
    if (currentUser === undefined) {
        res.json({code: 500, message: "Please Login. The Current User is not Authorized."});
        return;
    }

    //multers disk storage settings
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, config.imageRepo);
        },
        filename: function (req, file, cb) {
            //Store ImageMetadata in db
            var image_dimention = {
                top_left_x: 0,
                top_left_y: 0,
                bottom_right_x: 200,
                bottom_right_y: 200
            };
            ImageMetadata.create(
                {
                    uploaded_on: new Date(),
                    username: req.user.username,
                    image_type: 'Model_Train',
                    status: 'Model_To_Approve',
                    actual_label: req.body.controlLabel,
                    actual_text: req.body.controlText,
                    image_dimention: image_dimention,
                    object_width: req.body.width,
                    object_height: req.body.height,
                }, function (err, record) {
                    if (err) {
                        cb(new Error('There was an error in Uploading.'));
                        cb(null, false);
                    } else {
                        var newFileName = record._id + '.png';
                        file.newName = newFileName;
                        cb(null, newFileName);
                    }
                });
        }
    });

    var upload = multer({
        storage: storage
    }).single('file');

    upload(req, res, function (err) {

        if (err) {
            console.log(err);
            console.log("Error Getting Executed");
            res.json({code: 510, message: err});
            return;
        }
        res.json({code: 200, message: "File Uploaded Successfully."});
    });
};

exports.getUserModelList = function (req, res) {
    //var curentUserName = req.user.username;
    var currentPage = Number(req.params.pageno) || 1;
    var perPageLimit = Number(req.params.limit) || 25;
    ImageMetadata.paginate({image_type: 'Model_Train'},
        {
            page: currentPage,
            limit: perPageLimit,
            select: '_id image_type uploaded_on status actual_label actual_text prediction_label prediction_text username',
            sort: '-uploaded_on',
            lean: 'true'
        }).then(function (result) {
            res.send(result);
        });
};

exports.deleteControl = function (req, res) {
    var imageID = req.params.id;
    ImageMetadata.remove({_id: imageID}, function (err) {
        if (err) {
            return res.json({code: 510, message: "Error in removing Control from ImageMetadata"});
        }
        else {
            var file_name = config.imageRepo + '/' + imageID + '.png';
            fs.unlink(file_name);
            res.json({code: 200, message: "Control Removed"});
        }
    });
};

exports.getModelDownloadList = function (req, res) {
    var currentPage = Number(req.params.pageno) || 1;
    var perPageLimit = Number(req.params.limit) || 25;
    TestDataDownloadLog.paginate({},
        {
            page: currentPage,
            limit: perPageLimit,
            select: '_id download_link uploaded_on username include_users include_controls',
            sort: '-uploaded_on',
            lean: 'true'
        }).then(function (result) {
            res.send(result);
        });
};

exports.createZip = function (req,res) {
    //Get the paginated list and send
    var selectedUsers = req.body.selectedUsers;
    var selectedControls = req.body.selectedControls;
    var curentUserName = req.user.username;
    triggerZipCreation(selectedUsers, selectedControls, curentUserName);
    res.json({code: 200, message: "Trigger Started Successfully. Please Check for the link after a few minutes."});
};

var fsex = require('fs-extra');
var json2csv = require('json2csv');
var zipFolder = require('zip-folder');

function triggerZipCreation(selectedUsers, selectedControls, username) {
    //Create an entry in the Download log and get the ID
    TestDataDownloadLog.create(
        {
            uploaded_on: new Date(),
            username: username,
            include_users: selectedUsers,
            include_controls: selectedControls
        }, function (err, record) {
            if (err) {
                console.log(err);
                console.log('There was an error in Creating a Download Log entry.')
            } else {
                var keyId = record._id;
                var filterObj = {};
                filterObj['image_type'] = 'Model_Train';
                if(selectedUsers.indexOf('All') === -1) {
                    filterObj['username'] = {"$in" : selectedUsers};
                }
                if(selectedControls.indexOf('All') === -1) {
                    filterObj['actual_label'] = {"$in" : selectedControls};
                }
                //Select all images from image metadata matching the filter criteria
                ImageMetadata.find(filterObj).exec(function(err, records) {
                    if(err)console.log(err);
                    //copy and zip the images along with csv file
                    var imageCopyArray = [];
                    for(var i in records) {
                        imageCopyArray.push(records[i]._id);
                    }
                    var copyFolderPath = config.tempDirectory + '/' +keyId;
                    //Create a tempory directory to dump all files
                    fsex.mkdirs(copyFolderPath, function(err) {
                        if (err) return console.error(err);
                        //start creating the CSV file and save it in this location
                        var csv_fields = ['_id', 'image_type',
                            'object_width', 'object_height', 'uploaded_on', 'username',
                            'actual_label', 'actual_text'];
                        var csv = json2csv({ data: records, fields: csv_fields });
                        fs.writeFile(copyFolderPath + '/image_metadata.csv', csv, function(err) {
                            if (err) throw err;
                            console.log(copyFolderPath + '/image_metadata.csv' +' file saved');
                            //Copy all images with id in imageCopyArray
                            copyAllImagesAndProcess(copyFolderPath, imageCopyArray);
                        });
                    });
                });
            }
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
        var keyId= copyFolderPath.split('/').pop();
        var targetZip = config.tempDirectory + '/' + keyId + '.zip';
        zipFolder(copyFolderPath,  targetZip, function(err) {
            if(err) {
                console.log('Zip Creation failed.', err);
            } else {
                console.log('Zip Creation Done.');
                //upload the zip to s3
                uploadFileToS3(targetZip, keyId);
            }
        });
    },10000);
}

var AWS = require('aws-sdk');

// For dev purposes only
AWS.config.update({ accessKeyId: config.awsAcessKey, secretAccessKey: config.awssec });
var s3 = new AWS.S3();

function uploadFileToS3(targetZip, keyId) {
    fs.readFile(targetZip, function (err, data) {
        if (err) { throw err; }
        var params = {Bucket: config.awsBucket, Key: keyId + '.zip', Body: data};
        s3.putObject(params, function(err, data) {
            if (err)
                console.log(err);
            else {
                console.log("Successfully uploaded data to wie-zip/" + keyId);
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
                var url = config.s3Url + '/' + config.awsBucket + '/' +keyId + '.zip';
                updateWireframeURLRecord(keyId,url);
            }
        });
    });
}

function updateWireframeURLRecord(keyId,url) {
    TestDataDownloadLog.findByIdAndUpdate(
        keyId,
        {$set: {"download_link": url,"uploaded_on": new Date()}},
        {safe: true, new : true},
        function(err, model) {
            if (err) {
                console.log(err);
            }
            console.log('Test Data Drop Packed Created.');
        }
    );
}