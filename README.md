# CFMedia Directive to AngularJS

CFMedia is a simple directive to media upload inspired by Wordpress media style.

## It is assumed
- Install nodejs: `sudo apt-get install nodejs npm`
- Install bower and update: `sudo npm install -g bower` and `bower update`

## Usage
- With bower: `bower install --save cfmedia`
- Add **cf** as a dependency to your app. Example:
```
angular.module('example', [
    ...,
    'cf'
])
```

## In html:

```
<script src="./bower_components/is_js/is.min.js"></script>
<script src="./bower_components/cfmedia/dist/cfmedia.min.js"></script>
```

```
<div cfmedia
    ng-model="test"
    multiple="true"
    url="/public/path/upload/"
    accept="image/*,application/pdf"
    api="api/media"
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

** POR AQUI ME QUEDÉ LA EDICIÓN **

#### Controller

In the controller you should create a function with same name that parameter fnc of the directive, in this case is getData().

```
$scope.getData = function () {
    Model.query({
        offset: $scope.params.offset,
        limit : $scope.params.limit
    }, function (result) {
        $scope.years = result.data;
        $scope.params.total = result.meta.total;
    })
}
```

**$scope.params.offset** and **$scope.params.limit** is generated automatically by the directive. The initial value to $scope.params.limit is specified in the parameter "limit" in the html.

**$scope.params.total** must be instantiated when data from the API with the value of total elements are obtained in the Database.

To update the pagination when inserting or removing an item should use the event $emit:
```
// Remove function.
$scope.remove = function (index) {
    Model.remove(index);
    $scope.$emit('refresh:table:years_grid_listener');
}
```

Where "years_grid_listener" is the phrase specified by you in "on" parameter of directive.

## Installation for used example
- Install node http-server: `sudo npm install -g http-server`
- Access to folder `cd ./bower_components/cfpaginator`
- Execute command: `http-server .` and open browser with URL [http://localhost:8080/example/](http://localhost:8080/example/)
