/**
 * Created by subhasis on 11/1/16.
 */
var multer = require('multer');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var ImageMetadata = require('../models/ImageMetadata');

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
    var curentUserName = req.user.username;
    ImageMetadata.find({username: curentUserName, image_type: 'Model_Train'}).exec(function (err, collection) {
        var result = [];
        for (var i in collection) {
            var resultObj = {
                _id: collection[i]._id,
                image_type: collection[i].image_type,
                uploaded_on: collection[i].uploaded_on,
                status: collection[i].status,
                actual_label: collection[i].actual_label,
                actual_text: collection[i].actual_text,
                prediction_label: collection[i].prediction_label,
                prediction_text: collection[i].prediction_text
            };
            result.push(resultObj);
        }
        res.send(result);
    });
};