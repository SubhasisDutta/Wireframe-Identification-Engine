/**
 * Created by subhasis on 11/4/16.
 */

'use strict';

var modu = module.exports = angular.module('modules.account', ['ngResource',
    'modules.common']);

modu.factory('sdAuth', require('./sdAuth'));
modu.factory('sdIdentity', require('./sdIdentity'));
modu.controller('sdNavBarLoginCtrl', require('./sdNavBarLoginCtrl'));
modu.controller('sdProfileCtrl', require('./sdProfileCtrl'));
modu.controller('sdSignupCtrl', require('./sdSignupCtrl'));
modu.factory('sdUser', require('./sdUser'));