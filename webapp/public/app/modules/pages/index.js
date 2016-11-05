/**
 * Created by subhasis on 11/4/16.
 */
'use strict';

var modu = module.exports = angular.module('modules.pages', []);

modu.controller('sdPageDetailCtrl', require('./sdPageDetailCtrl'));
modu.controller('sdPublicPagesListCtrl', require('./sdPublicPagesListCtrl'));
modu.controller('sdUserPagesListCtrl', require('./sdUserPagesListCtrl'));