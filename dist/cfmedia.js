'use strict';

angular.module("cf", [])

/**
 * Directive to media upload as Wordpress´s media.
 * Example:
 *
 * <div cfmedia
 *   ng-model="test"
 *   multiple="true"
 *   url="/public/path/upload/"
 *   api="api/media" head="Upload Image">
 *     <button type="button" class="btn btn-default no-border">View Media Upload</button>
 * </div>
 *
 * The directive accepts the following attributes:
 *
 * - 'ng-model' : Required.
 * - 'head'     : Optional. Default value is 'Change Image'. String with the title of the modal.
 * - 'api'      : Optional. Default value is 'api/media'. String with the route of api media.
 * - 'url'      : Optional. Default value is '/public/path/upload/'. String with the url to path of public images.
 * - 'multiple' : Optional. Default value is true. Boolean with the options to multiples images or not.
 * - 'return'   : Optional. Default value is 'object'. String with the format to return result, "string" or "object".
 *                If "string" then only return the meta field of image object.
 *                If "object" then return the image object.
 */
  .directive('cfmedia', [function () {
    return {
      restrict   : 'A',
      replace    : true,
      transclude : true,
      require    : '?ngModel',
      scope      : {
        model      : '=ngModel',
        headTitle  : '@?head',
        apiUrl     : '@?api',
        srcUrl     : '@?url',
        multiple   : '=?multiple',
        returnModel: '@?return'
      },
      templateUrl: 'cfmedia.html',

      link: function (scope, element) {
        // Open modal.
        scope.openMediaModal = function () {
          element.find('.cfmedia-modal').modal();
        };

        scope.selectSave = function () {
          element.find('.cfmedia-modal').modal('hide');
        };
      },

      controller: ['$scope', '$timeout', 'Upload', 'Media', function ($scope, $timeout, Upload, Media) {
        $scope.headTitle = angular.isDefined($scope.headTitle) ? $scope.headTitle : 'Change Imagen';
        $scope.apiUrl = angular.isDefined($scope.apiUrl) ? $scope.apiUrl : 'api/media';
        $scope.srcUrl = angular.isDefined($scope.srcUrl) ? $scope.srcUrl : '/bundles/cfsclinic/upload/';
        $scope.returnModel = angular.isDefined($scope.returnModel) ? $scope.returnModel : 'object';

        $scope.elementsSelected = [];

        $scope.params = {
          limit : 10,
          offset: 0,
          search: ''
        };

        if ($scope.apiUrl) {
          $scope.progress = 0;
          var originalModel = angular.copy($scope.model);

          $scope.$watch('modelUpload', function () {
            if ($scope.modelUpload) {
              $scope.upload($scope.modelUpload);
            }
          });

          /**
           * Function to upload files.
           *
           * @param file
           */
          $scope.upload = function (file) {
            angular.forEach(file, function (item) {
              $scope.progress = '';
              Upload.upload({
                url   : $scope.apiUrl,
                fields: {},
                file  : item
              }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.progress = progressPercentage;
              }).success(function (result) {
                $scope.elements.push(result.data);
              }).error(function (data, status, headers, config) {
                console.log('error status: ' + status);
              })
            });

          };

          /**
           * Function to instantiate and check the elements selected.
           *
           * @param element
           * @param index
           */
          $scope.select = function (element, index) {
            if (is.not.inArray(element, $scope.elementsSelected)) {
              if ($scope.multiple) {
                element.activeClass = true;
                $scope.elementsSelected.push(element);
              } else {
                angular.forEach($scope.elements, function (value, key) {
                  $scope.elements[key].activeClass = false;
                });
                element.activeClass = true;
                $scope.elementsSelected = [];
                $scope.elementsSelected.push(element);
              }
            } else {
              angular.forEach($scope.elementsSelected, function (value, key) {
                if (value == element) {
                  $scope.elements[index].activeClass = false;
                  $scope.elementsSelected.splice(key, 1);
                }
              });
            }
          };

          /**
           * Function to execute when open modal.
           */
          $scope.openMediaModalCtrl = function () {
            $scope.multiple = angular.isDefined($scope.multiple) ? $scope.multiple : true;

            $scope.params = {
              limit : 10,
              offset: 0,
              search: ''
            };

            $scope.elementsSelected = [];
            $scope.elements = [];

            //Media.getAll({
            //  limit : $scope.params.limit,
            //  offset: $scope.params.offset,
            //  search: $scope.params.search
            //}, function (result) {
            //  $scope.elements = angular.copy(result.data);
            //});
          };

          /**
           * Function to instantiate model with the selected values.
           */
          $scope.selectSaveCtrl = function () {
            if ($scope.multiple) {
              if ($scope.returnModel == 'string') {
                angular.forEach($scope.elementsSelected, function (value) {
                  $scope.model.push(value.meta);
                });
              } else if ($scope.returnModel == 'object') {
                $scope.model = $scope.elementsSelected;
              }
            } else {
              if ($scope.returnModel == 'string') {
                $scope.model = $scope.elementsSelected[0].meta;
              } else if ($scope.returnModel == 'object') {
                $scope.model = $scope.elementsSelected[0];
              }
            }
          };

          /**
           * Function to load more elements from DB.
           */
          $scope.loadMore = function () {
            $scope.params.offset = ($scope.params.offset == 0) ? $scope.params.offset + $scope.params.limit : $scope.params.offset + $scope.params.offset;

            Media.getAll({
              limit : $scope.params.limit,
              offset: $scope.params.offset,
              search: $scope.params.search
            }, function (result) {
              if (result.data.length > 0) {
                angular.forEach(result.data, function (value) {
                  $scope.elements.push(value);
                });
              } else {
                console.log('No more elements in DB.');
              }
            });
          };

          $scope.$watch('search', function (newValue) {
            $scope.params.search = newValue;
            $scope.params.offset = 0;

            //Media.getAll({
            //  limit : $scope.params.limit,
            //  offset: $scope.params.offset,
            //  search: $scope.params.search
            //}, function (result) {
            //  if (result.data.length > 0) {
            //    $scope.elements = angular.copy(result.data);
            //  } else {
            //    console.log('No more elements in DB.');
            //  }
            //});
          });
        } else {
          console.log('La directiva cfmedia necesita la opción api con la url de la ruta para funcionar.');
        }
      }]
    }
  }]);