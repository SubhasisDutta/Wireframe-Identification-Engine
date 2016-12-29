/**
 * Created by subhasis on 11/4/16.
 */
'use strict';

require('angular-img-cropper');
require('ng-file-upload');

var modu = module.exports = angular.module('modules.process', ['angular-img-cropper', 'ngFileUpload']);

modu.controller('sdProcessAnnotateCtrl', require('./sdProcessAnnotateCtrl'));
modu.controller('sdProcessCropCtrl', require('./sdProcessCropCtrl'));
modu.controller('sdProcessIdentifyCtrl', require('./sdProcessIdentifyCtrl'));
modu.controller('sdProcessUploadCtrl', require('./sdProcessUploadCtrl'));
modu.controller('sdPrototypePreviewCtrl', require('./sdPrototypePreviewCtrl'));
modu.service('sdPrototypePreviewData', require('./services/sdPrototypePreviewData.service.js'));