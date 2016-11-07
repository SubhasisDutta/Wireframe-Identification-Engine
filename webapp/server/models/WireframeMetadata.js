/**
 * Created by subhasis on 11/6/16.
 */
var mongoose = require('mongoose');

var control = mongoose.Schema({
    controlImageId: {type: String, required: '{PATH} is required!'},
    uploaded_on: {type: Date, required: '{PATH} is required!'},
    username: {type: String, required: '{PATH} is required!'}
});

var wireframeMetadata = mongoose.Schema({
    title: {type: String, required: '{PATH} is required!'},
    wireframeImageId: {type: String, required: '{PATH} is required!'},
    uploaded_on: {type: Date, required: '{PATH} is required!'},
    username: {type: String, required: '{PATH} is required!'},
    wireframe_width: {type: Number},
    wireframe_height: {type: Number},
    acessType: {type: String, required: '{PATH} is required!'},
    //Public, Private
    controls: [control]
});

var WireframeMetadata = mongoose.model('WireframeMetadata', wireframeMetadata);

module.exports = WireframeMetadata;