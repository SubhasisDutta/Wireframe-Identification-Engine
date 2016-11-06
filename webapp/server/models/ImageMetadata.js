/**
 * Created by subhasis on 11/5/16.
 */
var mongoose = require('mongoose');

var prediction = mongoose.Schema({
    provider: {type:String, required:'{PATH} is required!'},
    result: {type : String}
}, {_id: false});

var position = mongoose.Schema({
    top_left_x: {type: Number, required:'{PATH} is required!'},
    top_left_y: {type: Number, required:'{PATH} is required!'},
    bottom_right_x: {type: Number, required:'{PATH} is required!'},
    bottom_right_y: {type: Number, required:'{PATH} is required!'}
}, {_id: false});

var imageMetadata = mongoose.Schema({
    image_type : {type:String, required:'{PATH} is required!'},
    //Model_Train, Model_Test, Model_Validation, Wireframe, Wireframe_Control
    status: {type: String, required:'{PATH} is required!'},
    //Model_To_Approve, Model_Not_Processed, Model_Processed, Wireframe,
    //Control_Not_Processed, Control_Marked, Control_Identified,
    actual_label: {type: String},
    actual_text: {type: String},
    prediction_label: [prediction],
    prediction_text: [prediction],
    image_dimention : position,
    object_width: {type: Number},
    object_height: {type: Number},
    uploaded_on: {type:Date, required:'{PATH} is required!'},
    username: {type: String,required: '{PATH} is required!'},
    tags: [String]
});

var ImageMetadata = mongoose.model('ImageMetadata', imageMetadata);

module.exports = ImageMetadata;