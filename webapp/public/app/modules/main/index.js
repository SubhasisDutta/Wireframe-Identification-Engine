/**
 * Created by subhasis on 11/4/16.
 */
'use strict';

var modu = module.exports = angular.module('modules.main', ['modules.account']);

modu.controller('sdMainCtrl', require('./sdMainCtrl'));