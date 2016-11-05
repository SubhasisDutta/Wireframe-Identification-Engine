/**
 * Created by subhasis on 11/4/16.
 */
'use strict';

var toastr = require('toastr');

var app = angular.module('app');

app.factory('sdNotifier', require('./sdNotifier'));
app.value('sdToastr', toastr);