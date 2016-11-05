/**
 * Created by subhasis on 11/4/16.
 */
'use strict';

require('angular-img-cropper');
require('ng-file-upload');

var modu = module.exports = angular.module('modules.train', ['angular-img-cropper', 'ngFileUpload']);

modu.controller('sdContributeImageLabelCtrl', require('./sdContributeImageLabelCtrl'));
modu.controller('sdContributeImageUploadCtrl', require('./sdContributeImageUploadCtrl'));
modu.controller('sdModelListCtrl', require('./sdModelListCtrl'));
modu.controller('sdRebuildCtrl', require('./sdRebuildCtrl'));