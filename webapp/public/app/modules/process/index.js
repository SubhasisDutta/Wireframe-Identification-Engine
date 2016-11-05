/**
 * Created by subhasis on 11/4/16.
 */
'use strict';

var modu = module.exports = angular.module('modules.process', []);

modu.controller('sdProcessAnnotateCtrl', require('./sdProcessAnnotateCtrl'));
modu.controller('sdProcessCropCtrl', require('./sdProcessCropCtrl'));
modu.controller('sdProcessIdentifyCtrl', require('./sdProcessIdentifyCtrl'));
modu.controller('sdProcessUploadCtrl', require('./sdProcessUploadCtrl'));