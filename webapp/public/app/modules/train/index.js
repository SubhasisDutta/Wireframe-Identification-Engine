/**
 * Created by subhasis on 11/4/16.
 */
'use strict';

var modu = module.exports = angular.module('modules.train', []);

modu.controller('sdContributeImageLabelCtrl', require('./sdContributeImageLabelCtrl'));
modu.controller('sdContributeImageUploadCtrl', require('./sdContributeImageUploadCtrl'));
modu.controller('sdModelListCtrl', require('./sdModelListCtrl'));
modu.controller('sdRebuildCtrl', require('./sdRebuildCtrl'));