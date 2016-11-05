/**
 * Created by subhasis on 11/4/16.
 */

'use strict';

var app = angular.module('app');

app.factory('sdAuth', require('./sdAuth'));
app.factory('sdIdentity', require('./sdIdentity'));
app.controller('sdNavBarLoginCtrl', require('./sdNavBarLoginCtrl'));
app.controller('sdProfileCtrl', require('./sdProfileCtrl'));
app.controller('sdSignupCtrl', require('./sdSignupCtrl'));
app.factory('sdUser', require('./sdUser'));