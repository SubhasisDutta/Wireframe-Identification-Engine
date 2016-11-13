/**
 * Created by subhasis on 11/1/16.
 */

var wireframeMetadata = require('../models/WireframeMetadata');

exports.getAllPublicPages = function(req, res) {

};

exports.getUserPages = function(req, res) {
    var curentUserName = req.user.username;
    wireframeMetadata.find({username: curentUserName}).exec(function (err, collection) {
        var result = [];
        for (var i in collection) {
            var resultObj = {
                _id: collection[i]._id,
                title: collection[i].title,
                uploaded_on: collection[i].uploaded_on,
                wireframeImageId: collection[i].wireframeImageId,
                wireframe_width: collection[i].wireframe_width,
                wireframe_height: collection[i].wireframe_height,
                no_of_controls: collection[i].controls.length,
                acessType: collection[i].acessType
            };
            result.push(resultObj);
        }
        res.send(result);
    });
};