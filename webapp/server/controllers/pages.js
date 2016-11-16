/**
 * Created by subhasis on 11/1/16.
 */

var wireframeMetadata = require('../models/WireframeMetadata');

exports.getAllPublicPages = function(req, res) {
    var currentPage = Number(req.params.pageno) || 1;
    var perPageLimit = Number(req.params.limit) || 20;
    wireframeMetadata.paginate({acessType: 'Public'},
        {
            page: currentPage,
            limit: perPageLimit,
            select: '_id title uploaded_on username wireframeImageId wireframe_width wireframe_height controls.count()',
            sort: '-uploaded_on',
            lean: 'true'
        }).then(function (result) {
            res.send(result);
        });
};

exports.getUserPages = function(req, res) {
    var curentUserName = req.user.username;
    var currentPage = Number(req.params.pageno) || 1;
    var perPageLimit = Number(req.params.limit) || 20;
    wireframeMetadata.paginate({username: curentUserName},
        {
            page: currentPage,
            limit: perPageLimit,
            select: '_id title uploaded_on wireframeImageId wireframe_width wireframe_height acessType controls.length',
            sort: '-uploaded_on',
            lean: 'true'
        }).then(function (result) {
            res.send(result);
        });
};