/**
 * Created by subhasis on 11/4/16.
 */
'use strict';

var modu = module.exports = angular.module('modules.admin', ['modules.account']);

modu.controller('sdUserListCtrl', require('./sdUserListCtrl'));