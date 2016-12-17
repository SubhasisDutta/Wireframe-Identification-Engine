'use strict';

global.jQuery = require('jquery');

require('bootstrap');

require('angular');

require('angular-resource');
require('angular-route');


require('./modules/account');
require('./modules/admin');
require('./modules/common');
require('./modules/main');
require('./modules/pages');
require('./modules/process');
require('./modules/train');

var app = module.exports = angular.module('app', ['ngRoute',
        'modules.account', 'modules.admin', 'modules.common', 'modules.main', 'modules.pages',
        'modules.process', 'modules.train']);

app.config(function ($routeProvider, $locationProvider) {
    var routeRoleChecks = {
        admin: {
            auth: function (sdAuth) {
                return sdAuth.authorizeCurrentUserForRoute('admin')
            }
        },
        user: {
            auth: function (sdAuth) {
                return sdAuth.authorizeAuthenticatedUserForRoute()
            }
        }
    };

    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {templateUrl: '/partials/main/main', controller: 'sdMainCtrl'})
        .when('/admin/users', {
            templateUrl: '/partials/admin/user-list',
            controller: 'sdUserListCtrl', resolve: routeRoleChecks.admin
        })
        .when('/signup', {
            templateUrl: '/partials/account/signup',
            controller: 'sdSignupCtrl'
        })
        .when('/profile', {
            templateUrl: '/partials/account/profile',
            controller: 'sdProfileCtrl', resolve: routeRoleChecks.user
        })
        .when('/public', {
            templateUrl: '/partials/pages/public-page-list',
            controller: 'sdPublicPagesListCtrl'
        })
        .when('/pages', {
            templateUrl: '/partials/pages/user-page-list',
            controller: 'sdUserPagesListCtrl', resolve: routeRoleChecks.user
        })
        .when('/pagedetail/:id', {
            templateUrl: '/partials/pages/page-details',
            controller: 'sdPageDetailCtrl'
        })
        .when('/contribute/upload', {
            templateUrl: '/partials/train/upload-train-image',
            controller: 'sdContributeImageUploadCtrl', resolve: routeRoleChecks.user
        })
        .when('/contribute/list', {
            templateUrl: '/partials/train/contribute-image-list',
            controller: 'sdContributeImageListCtrl'
        })
        .when('/modellist', {
            templateUrl: '/partials/train/model-list',
            controller: 'sdModelListCtrl', resolve: routeRoleChecks.user
        })
        .when('/rebuild', {
            templateUrl: '/partials/train/rebuild-model',
            controller: 'sdRebuildCtrl', resolve: routeRoleChecks.admin
        })
        .when('/process/upload', {
            templateUrl: '/partials/process/upload-wireframe',
            controller: 'sdProcessUploadCtrl', resolve: routeRoleChecks.user
        })
        .when('/process/identify/:id', {
            templateUrl: '/partials/process/identify-wireframe',
            controller: 'sdProcessIdentifyCtrl', resolve: routeRoleChecks.user
        })
        .when('/process/annotate/:id', {
            templateUrl: '/partials/process/annotate-wireframe',
            controller: 'sdProcessAnnotateCtrl', resolve: routeRoleChecks.user
        });
});
app.run(function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
        if (rejection === 'not authorized') {
            $location.path('/');
        }
    })
});
