# ciandt-components-factory
Factory helper to create with facility angularjs components (controllers, directives, filters...) and ensures that all dependencies are loaded before, using requirejs. In other words, the factory easily integrate requirejs and angular. The factory should be used on javascript file to declare same angularjs components types. Each components types has a factory function. See more below.

### Install

* Install the dependency:

   ```shell
   bower install ciandt-components-factory --save
   ```
* Add factory.js to your code:

   ```html
   <script src='assets/libs/ciandt-components-factory/factory.js'></script>
   ```
   - note that the base directory used was assets/libs, you should change bower_components to assets/libs or move from bower_components to assets/libs with grunt.
* Include module dependency:

   ```javascript
   angular.module('yourApp', ['ciandt.components.factory']);
   ```
======

### How To Use

1. **newController(controllerName, func)**
   - this function create a new controller in your app angular module
   ```javascript
   factory.newController("yourController", [function () {
      // your controller body
	  // we recommend write controller using vm pattern
   }]);
   ```
2. **newService(serviceName, api, actions, params)**
   - this function create a new service based in $resource
   ```javascript
   factory.newService("yourService", 'api/myAction/:userId', {'get': {method: 'GET'}}, {itemId:'@id'});
   .
   .
   // using 'yourService' in controller
   app.controller(['yourService', function (yourService) {
      var item = yourService.get(id);
	  item.post();
   }])
   ```
3. **newModal(directiveName, templateUrl, controllerName, injection, modalOptions)**
   - this function create a new directive and controller at the same time, to open modal. It uses ciandt.components.dialogs.ModalHelper to open the modal.
   -- directiveName: directive name that will be created
   -- templateUrl: url to your html
   -- controllerName: controller name that will be created
   -- injection: it's an array that represent injections, input params and the controller function. Important: if your controller needs input parametters, you should declare imediatly before controller function, in an array of strings.
   -- modalOptions: modal options, e.g. {size: 'lg'}
   ```javascript
   factory.newModal("yourModalDirective", 'app/view/yourModal.html', ['myService', ['param1', 'param2'], function (myService, param1, param2) {
      // your controller body
	  // we recommend write controller using vm pattern
   }], {size: 'lg'});
   ```
   ```html
   <button your-modal-directive></button>
   Or
   <input your-modal-directive="onblur">
   ```
   - the example above will open the page 'app/view/yourModal.html' in a modal using $modal (an angular-bootstrap component)
4. **newDirective(name, injects)**
   - this function create a new directive in your app angular module
   ```javascript
   factory.newDirective("yourDirective", [function () {
      return {
         restrict: 'A',
         link: function (scope, element, attrs) {
		 ...
         }
      }
   }]);
   ```
5. **newFilter(name, injects)**
   - this function create a new filter in your app angular module
   ```javascript
   factory.newFilter('haveModuleWithFeatures', [function () {
      return function (values) {
         return ...;
      }
   ]);
   ```
6. **loadModules(url, options, onloadmodule, onfinish)**
   - this function load all modules returned by response url called. It's recomended if your app has modules with dynamicly load.
   - options:
   -- ignoredModules: list of modules to ignore
   -- envJsPath: path to env settings json module
   -- appJsPath: path to app.js module
   ```javascript
   factory.loadModules('myModules.json', {ignoredModules: ['common'], envJsPath: 'app/{module}/env.js', appJsPath: 'app/{module}/app.js'}, function (module, moduleEnvSettings) {
         // event called on finish load each module
      },
      function (modules) {
         // event called on finish load all modules
      }
   );
   
   // myModules.json:
   define({modules:['common', 'security', 'billing']});
   ```
   - this function also create a Restangular service for each module, it's named [module]RestService. You can disable this feature, use options useRestangular=false for this.
7. **newModule(module, externalDepsJs, depsModules, internalDepsJs, funcConfig, funcRun)**
   - this function create a module in your angular app
   ```javascript
   factory.newModule('myModule',
      [/*external scripts need in this module, ex: jquery, dojo, angular-ngMask, etc...*/
         'assets/libs/externalScript1.js',
		 'assets/libs/externalScript2.js'
      ],
      [/*módulos angular dependentes deste sistema*/
         'ngMask'
      ],
      [/*internal scripts need in this module, ex: directives, filters, controllers, etc...*/
         'app/mymodule/directives/my-directives.js'
      ],
      [/*angular config block for this module*/
         'ngMaskConfig', function(ngMaskConfig){
            ...
         }
      ],
      [/*angular run block for this module*/
         '$rootScope', function($rootScope){
            ...
         }
      ]);
   ```