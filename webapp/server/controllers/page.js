/**
 * Created by subhasis on 11/1/16.
 */
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];


exports.getPageById = function(req, res) {

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