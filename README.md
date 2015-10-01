# CFMedia Directive to AngularJS

CFMedia is a simple directive to media upload inspired by Wordpress media style and based on the directive [ng-file-upload](https://github.com/danialfarid/ng-file-upload).

View [Example](http://cfmedia.miwp.eu/example/)

## It is assumed
- Install nodejs: `sudo apt-get install nodejs npm`
- Install bower and update: `sudo npm install -g bower` and `bower update`

## Usage
- With bower: `bower install --save cfmedia`
- Add **cf** as a dependency to your app. Example:
```
angular.module('example', [
    'cf'
])
```

## In html:

External libraries scripts:

```
<script src="./bower_components/is_js/is.min.js"></script>
<script src="./bower_components/ng-file-upload-shim/ng-file-upload-shim.min.js"></script>
<script src="./bower_components/ng-file-upload/ng-file-upload.min.js"></script>
```
Directive script:

```
<script src="./bower_components/cfmedia/dist/cfmedia.min.js"></script>
```

Usage:

```
<div cfmedia
    ng-model="test"
    multiple="false"
    url="/public/path/upload/"
    accept="image/*,application/pdf"
    api="api/media"
    order="date"
    head="Upload Image">
      <button type="button" class="btn btn-default">View Media Upload</button>
</div>
```

## Options
The directive accepts the following attributes:

| Option | Description |
|--------|--------|
|    ng-model    |    Required    |
|    head    |    Optional. Default value is 'Change Image'. String with the title of the modal.    |
|    api    |    Optional. Default value is 'api/media'. String with the route of api media.    |
|    url    |    Optional. Default value is '/public/path/upload/'. String with the url to path of public images.    |
|    multiple    |    Optional. Default value is true. Boolean with the options to multiples images or not.    |
|    return    |    Optional. Default value is 'object'. String with the format to return result, "string" or "object".  |
|        |    If "string" then only return the meta field of image object.    |
|        |    If "object" then return the image object.    |
|    accept    |    Optional. Default value is 'image/*'. String with function or comma separated wildcard to filter files allowed.    |
|        |    .pdf,.jpg    |
|        |    image/*,application/pdf    |
|        |    audio/*,video/*    |
|    order    |    Optional. Default value is 'date'. String with the option to order by elements result.    |
|    filter    |    Optional. Default value is 'meta'. String with field name of object that contain image name, example: dc3443.png    |

#### Factory - Required

Factory with name **Media** and function with name **getAll**.

Where **getAll** return a object list where each object contain a **meta** field with the name of the image saved in the public folder

If your model not contain a **meta** field then you should specify the name of the field in the option **filter** of the directive cfmedia.

`filter="meta"`

The idea is have an only model in order to work with all the images.

###### Example of Media Model with $http

```
.factory('Media', ['$http', function ($http) {
    var route = 'media';

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
}])
```

###### Example of Media Model with Restangular

```
.factory('Media', ['Restangular', function (Restangular) {
    var route = 'media';

    return {
      all         : Restangular.all(route),
      service     : Restangular.service(route),

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
      getAll      : function (jsonObject, callback) {
        Restangular.all(route).customGET('', {
          code  : 'list',
          limit : jsonObject.limit,
          offset: jsonObject.offset,
          search: jsonObject.search
        }).then(function (result) { // Success.
            callback(result.data);
          },
          function (error) { // Error from server.
            console.log('not access: ', error);
          })
      }
}])
```

## Installation for used example

#### Apache Server

- Copy cfmedia folder to /var/www/html/
- Open browser with URL: [http://localhost/cfmedia/example/](http://localhost/cfmedia/example/)
