/**
 * Created by subhasis on 11/1/16.
 */
var multer = require('multer');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var ImageMetadata = require('../models/ImageMetadata');
var wireframeMetadata = require('../models/WireframeMetadata');


exports.uploadWireframeImage = function (req, res) {
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
                bottom_right_x: req.body.width,
                bottom_right_y: req.body.height
            };
            ImageMetadata.create(
                {
                    uploaded_on: new Date(),
                    username: req.user.username,
                    image_type: 'Wireframe',
                    status: 'Wireframe',
                    image_dimention: image_dimention
                }, function (err, record) {
                    if (err) {
                        cb(new Error('There was an error in Uploading.'));
                        cb(null, false);
                    } else {
                        var newFileName = record._id + '.png';
                        req.body.recordId = record._id + '';
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
        wireframeMetadata.create(
            {
                title: req.body.title,
                uploaded_on: new Date(),
                username: req.user.username,
                wireframeImageId: req.body.recordId,
                wireframe_width: req.body.width,
                wireframe_height: req.body.height,
                acessType: req.body.acessType,
            }, function (err, record) {
                if (err) {
                    res.json({code: 510, message: err});
                } else {
                    res.json({code: 200, message: "Wireframe Uploaded Successfully.", id: record._id});
                }
            });


    });
};

exports.identifyWireframe = function (req, res) {
    wireframeMetadata.findOne({_id: req.params.id}).exec(function (err, appData) {
        if (err) {
            res.status(404);
            return res.send({reason: err.toString()});
        }
        var responceObj = {
            _id: appData._id,
            title: appData.title,
            wireframeImageId: appData.wireframeImageId,
            uploaded_on: appData.uploaded_on,
            username: appData.username,
            wireframe_width: appData.wireframe_width,
            wireframe_height: appData.wireframe_height,
            acessType: appData.acessType,
            controls: appData.controls
        };
        res.send(responceObj);
    });
};

exports.annotateWireframe = function (req, res) {

};

exports.startIdentification = function (req, res) {

};