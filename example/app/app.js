'use strict';

// Declare app level module which depends on filters, and services.
angular.module('example', [
  'ngFileUpload',
  'cf'
])

  .controller('ExampleController', ['$scope', 'Media', function ($scope, Media) {
    console.log('ok')
  }])

  .factory('Media', ['$rootScope', function ($rootScope) {
    return {}
  }]);