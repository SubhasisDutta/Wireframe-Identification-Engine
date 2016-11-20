/**
 * Created by subhasis on 11/19/16.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');


var testDataDownloadLog = mongoose.Schema({
    download_link: {type: String},
    uploaded_on: {type: Date, required: '{PATH} is required!'},
    username: {type: String, required: '{PATH} is required!'},
    include_users: [String],
    include_controls: [String]
});


testDataDownloadLog.plugin(mongoosePaginate);

var TestDataDownloadLog = mongoose.model('TestDataDownloadLog', testDataDownloadLog);

module.exports = TestDataDownloadLog;