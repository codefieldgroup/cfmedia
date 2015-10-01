'use strict';

angular.module("cf", [
  'ngFileUpload'
])

/**
 * Directive to media upload as Wordpress´s media.
 * Example:
 *
 * <div cfmedia
 *   ng-model="test"
 *   multiple="true"
 *   url="/public/path/upload/"
 *   accept="image/*,application/pdf"
 *   api="api/media"
 *   head="Upload Image">
 *     <button type="button" class="btn btn-default no-border">View Media Upload</button>
 * </div>
 *
 * The directive accepts the following attributes:
 *
 * - 'ng-model' : Required.
 * - 'head'     : Optional. Default value is 'Change Image'. String with the title of the modal.
 * - 'api'      : Optional. Default value is 'api/media'. String with the route of api media.
 * - 'url'      : Optional. Default value is '/public/upload/'. String with the url to path of public images.
 * - 'multiple' : Optional. Default value is true. Boolean with the options to multiples images or not.
 * - 'return'   : Optional. Default value is 'object'. String with the format to return result, "string" or "object".
 *                If "string" then only return the meta field of image object.
 *                If "object" then return the image object.
 * - 'accept'   : Optional. Default value is 'image/*'. String with function or comma separated wildcard to filter files allowed.
 *                Other options:
 *                  .pdf,.jpg
 *                  image/*,application/pdf
 *                  audio/*
 *                  video/*
 * - 'order'    : Optional. Default value is 'date'. String with the option to order by elements result.
 * - 'filter'   : Optional. Default value is 'meta'. String with field name of object that contain image name, example: dc3443.png
 */
  .directive('cfmedia', [function () {

    var strTemplate = "";
    strTemplate += "<div class=\"cfmedia\">";
    strTemplate += "  <style>";
    strTemplate += "    .cfmedia .jumbotron {";
    strTemplate += "      border     : 4px dashed #b4b9be;";
    strTemplate += "      text-align : center;";
    strTemplate += "    }";
    strTemplate += "";
    strTemplate += "    .cfmedia .thumbnail {";
    strTemplate += "      padding       : 1px;";
    strTemplate += "      border        : 0px solid #ddd;";
    strTemplate += "      border-radius : 0px;";
    strTemplate += "      max-height    : 190px;";
    strTemplate += "      overflow      : hidden;";
    strTemplate += "    }";
    strTemplate += "";
    strTemplate += "    .cfmedia .thumbnail img {";
    strTemplate += "      height : 112px;";
    strTemplate += "    }";
    strTemplate += "";
    strTemplate += "    .cfmedia .selected img {";
    strTemplate += "      border        : 2px dashed #428BCA;";
    strTemplate += "      border-radius : 0px;";
    strTemplate += "    }";
    strTemplate += "";
    strTemplate += "    .cfmedia .cf-search {";
    strTemplate += "      background-color : #EEEEEE;";
    strTemplate += "      padding          : 3px 5px;";
    strTemplate += "    }";
    strTemplate += "  <\/style>";
    strTemplate += "  <div ng-transclude ng-click=\"openMediaModal(); openMediaModalCtrl()\"><\/div>";
    strTemplate += "";
    strTemplate += "  <!-- Modal -->";
    strTemplate += "  <div class=\"cfmedia-modal modal fade\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modalLabel\" aria-hidden=\"true\">";
    strTemplate += "    <div class=\"modal-dialog\" style=\"z-index : 1030; width : 92%;\">";
    strTemplate += "      <div class=\"modal-content\">";
    strTemplate += "        <div class=\"modal-header\">";
    strTemplate += "          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;<\/button>";
    strTemplate += "          <h4 class=\"modal-title\" id=\"modalLabel\">{{ headTitle }}<\/h4>";
    strTemplate += "        <\/div>";
    strTemplate += "        <div class=\"modal-body\">";
    strTemplate += "          <div class=\"row\">";
    strTemplate += "            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12\">";
    strTemplate += "              <div class=\"jumbotron\" style=\"padding: 17px 0; margin-bottom: 0px;\"";
    strTemplate += "                   ngf-drop";
    strTemplate += "                   ng-model=\"modelUpload\"";
    strTemplate += "                   class=\"drop-box\"";
    strTemplate += "                   ngf-drag-over-class=\"dragover\"";
    strTemplate += "                   ngf-multiple=\"true\"";
    strTemplate += "                   ngf-allow-dir=\"true\"";
    strTemplate += "                   ngf-accept=\"accept\"";
    strTemplate += "                      >";
    strTemplate += "                <h3 style=\"margin-top: -3px;color: #393939;\">";
    strTemplate += "                  Drop files anywhere to upload";
    strTemplate += "                <\/h3>";
    strTemplate += "";
    strTemplate += "                <p class=\"lead\" style=\"color: #393939;\">";
    strTemplate += "                  <translate>or<\/translate>";
    strTemplate += "                <\/p>";
    strTemplate += "";
    strTemplate += "                <button ngf-select ngf-multiple=\"true\" ng-model=\"modelUpload\" type=\"button\"";
    strTemplate += "                        class=\"btn btn-primary btn-lg no-border\"";
    strTemplate += "                        style=\"font-size: 16px;\"";
    strTemplate += "                        ngf-accept=\"accept\">";
    strTemplate += "                  Select Files";
    strTemplate += "                <\/button>";
    strTemplate += "              <\/div>";
    strTemplate += "            <\/div>";
    strTemplate += "";
    strTemplate += "            <div class=\"col-md-12 col-lg-12 col-sm-12 col-xs-12\">";
    strTemplate += "              <div class=\"col-md-12 cf-search\">";
    strTemplate += "                <div class=\"input-group input-group-sm col-md-4 col-lg-4 col-sm-12 col-xs-12 pull-right\">";
    strTemplate += "                  <span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-search\"><\/i><\/span>";
    strTemplate += "                  <input type=\"text\" class=\"form-control\" ng-model=\"search\" placeholder=\"Search ...\">";
    strTemplate += "                <\/div>";
    strTemplate += "              <\/div>";
    strTemplate += "";
    strTemplate += "              <div class=\"col-md-12\" style=\"height: 256px; overflow: auto; margin-top: 14px;\">";
    strTemplate += "                <div ng-repeat=\"element in elements | orderBy:order:true\" class=\"col-lg-2 col-md-2 col-sm-12 col-xs-12 thumbnail\"";
    strTemplate += "                     ng-class=\"{'selected': element.activeClass}\"";
    strTemplate += "                     ng-click=\"select(element, $index)\">";
    strTemplate += "                  <img ng-src=\"{{ srcUrl + element[filter] }}\" class=\"img-thumbnail\" alt=\"\">";
    strTemplate += "                <\/div>";
    strTemplate += "              <\/div>";
    strTemplate += "";
    strTemplate += "              <button type=\"button\" class=\"btn btn-white no-border\" ng-click=\"loadMore()\" style=\"width: 100%;\">";
    strTemplate += "                <i class=\"glyphicon glyphicon-plus\"><\/i>";
    strTemplate += "                Show More";
    strTemplate += "              <\/button>";
    strTemplate += "            <\/div>";
    strTemplate += "          <\/div>";
    strTemplate += "        <\/div>";
    strTemplate += "        <div class=\"modal-footer\">";
    strTemplate += "          <button type=\"button\" class=\"btn btn-default no-border\" data-dismiss=\"modal\">";
    strTemplate += "            <translate>Close<\/translate>";
    strTemplate += "          <\/button>";
    strTemplate += "          <button type=\"button\" class=\"btn btn-primary no-border\" ng-click=\"selectSaveCtrl(); selectSave()\">";
    strTemplate += "            <translate>Ok<\/translate>";
    strTemplate += "          <\/button>";
    strTemplate += "        <\/div>";
    strTemplate += "      <\/div>";
    strTemplate += "    <\/div>";
    strTemplate += "  <\/div>";
    strTemplate += "<\/div>";

    return {
      restrict  : 'A',
      replace   : true,
      transclude: true,
      require   : '?ngModel',
      scope     : {
        model      : '=ngModel',
        headTitle  : '@?head',
        apiUrl     : '@?api',
        srcUrl     : '@?url',
        multiple   : '=?multiple',
        returnModel: '@?return',
        accept     : '@?',
        order      : '@?',
        filter     : '@?'
      },
      template  : strTemplate,

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
        $scope.apiUrl = angular.isDefined($scope.apiUrl) ? $scope.apiUrl : 'api/media';
        $scope.srcUrl = angular.isDefined($scope.srcUrl) ? $scope.srcUrl : '/public/upload/';

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
                $scope.elements.push(result);
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
            $scope.headTitle = angular.isDefined($scope.headTitle) ? $scope.headTitle : 'Change Imagen';
            $scope.returnModel = angular.isDefined($scope.returnModel) ? $scope.returnModel : 'object';
            $scope.accept = angular.isDefined($scope.accept) ? $scope.accept : 'image/*';
            $scope.order = angular.isDefined($scope.order) ? $scope.order : 'date';
            $scope.filter = angular.isDefined($scope.filter) ? $scope.filter : 'meta';

            $scope.params = {
              limit : 10,
              offset: 0,
              search: ''
            };

            $scope.elementsSelected = [];
            $scope.elements = [];

            Media.getAll({
              limit : $scope.params.limit,
              offset: $scope.params.offset,
              search: $scope.params.search
            }, function (result) {
              $scope.elements = angular.copy(result);
            });
          };

          /**
           * Function to instantiate model with the selected values.
           */
          $scope.selectSaveCtrl = function () {
            if ($scope.elementsSelected.length > 0) {
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
            } else {
              alert('Please select one element.');
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
              if (result.length > 0) {
                angular.forEach(result, function (value) {
                  $scope.elements.push(value);
                });
              } else {
                alert('No more elements in DB.');
              }
            });
          };

          $scope.$watch('search', function (newValue) {
            $scope.params.search = newValue;
            $scope.params.offset = 0;

            Media.getAll({
              limit : $scope.params.limit,
              offset: $scope.params.offset,
              search: $scope.params.search
            }, function (result) {
              if (result.length > 0) {
                $scope.elements = angular.copy(result);
              } else {
                alert('No more elements in DB.');
              }
            });
          });
        }
      }]
    }
  }]);