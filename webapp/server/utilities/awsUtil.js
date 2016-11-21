/**
 * Created by subhasis on 11/21/16.
 */
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var AWS = require('aws-sdk');
const fs = require('fs');
var fsex = require('fs-extra');

// For dev purposes only
AWS.config.update({ accessKeyId: config.awsAcessKey, secretAccessKey: config.awssec });
var s3 = new AWS.S3();

exports.uploadFileToS3 = function (targetZip, keyId, callback) {
    fs.readFile(targetZip, function (err, data) {
        if (err) { throw err; }
        var params = {Bucket: config.awsBucket, Key: keyId + '.zip', Body: data};
        s3.putObject(params, function(err, data) {
            if (err)console.log(err);
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
                callback(keyId,url);
            }
        });
    });
};