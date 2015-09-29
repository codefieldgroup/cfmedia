'use strict';

// Declare app level module which depends on filters, and services.
angular.module('example', [
  'cf'
])

  .controller('ExampleController', ['$scope', function ($scope) {
    $scope.removeImage = function () {
      $scope.test = null;
    };
  }])

  .factory('Media', ['$http', function ($http) {
    var route = 'server.php';

    return {

      /**
       * Get all element by pagination or not.
       *
       * @param jsonObject : Object to getting the data with pagination. Example of their parameters:
       *  {
       *   limit : 10,
       *   offset: 0,
       *   search: ''
       *  }
       * @param callback
       */
      getAll: function (jsonObject, callback) {
        $http({
          method: 'GET',
          url   : route,
          params: jsonObject
        })
          .success(function (result) {
            callback(result);
          })
          .error(function (error, status) {
            console.log('not access: ', status, error);
          });
      }

    }
  }]);