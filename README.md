# ciandt-components-factory
Factory helper to easily create angularjs components (controllers, directives, filters...) and ensures that all dependencies are loaded before it, using requirejs. In other words, the factory easily integrates requirejs and angular. The factory should be used on a javascript file to declare same angularjs components types. Each component type has a factory function. See more below.

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

* Requirements:

   * the factory work with control of script version and load the correct script based on version mapper. Your app should has the version.json file, where you should write the mapping between original js file and version named js file. The version.json file is loaded on load factory, using requirejs. The version.json content should be similar to:
   ```json
   {
      "version": "1.0.0",
      "files": {
         "yourScript.js": "yourScript-hashGenOnBuild.js"
      }
   }
   ```

   - version.json
   - lodash: it's used in internal statement
   - ciandt.components.dialogs: it's used to open the modal (newModal function below)
   - requirejs: it's used to load the module scripts (app.js, env.js, etc).
   - restangular: it's used to create a restangular factory to the module (newModule function below).
   - file-saver-saveas-js: it's used to expose methods to download using restangular factory.

======

### How To Use

1. **newController(controllerName, func)**
   - this function creates a new controller in your angular module
   ```javascript
   factory.newController("yourController", [function () {
      // your controller body
	  // we recommend write controller using vm pattern
   }]);
   ```

2. **newService(serviceName, api, actions, params)**
   - this function creates a new service based in $resource
   ```javascript
   factory.newService("yourService", 'api/myAction/:userId', {'get': {method: 'GET'}}, {itemId:'@id'});
   .
   .
   // using 'yourService' in a controller
   app.controller(['yourService', function (yourService) {
      var item = yourService.get(id);
	  item.post();
   }])
   ```

3. **newModal(directiveName, templateUrl, controllerName, injection, modalOptions)**
   * this function creates a new directive and a controller at the same time, to open as a modal. It uses ciandt.components.dialogs.ModalHelper to open the modal.
   - directiveName: directive name that will be created
   - templateUrl: url to your html
   - controllerName: controller name that will be created
   - injection: it's an array that represent injections, input params and the controller function. Important: if your controller needs input parametters, you should declare them imediately before the controller function, in an array of strings.
   - modalOptions: modal options, e.g. {size: 'lg'}
   ```javascript
   factory.newModal("yourModalDirective", 'app/view/yourModal.html', ['myService', ['param1', 'param2'], function (myService, param1, param2) {
      // your controller body
	  // we recommend writting the controller using the vm pattern
   }], {size: 'lg'});
   ```
   ```html
   <button your-modal-directive></button>
   Or
   <input your-modal-directive="onblur">
   ```
   - the example above will open the page 'app/view/yourModal.html' in a modal using $modal (an angular-bootstrap component)

4. **newDirective(name, injects)**
   - this function creates a new directive in your angular module
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
   - this function creates a new filter in your angular module
   ```javascript
   factory.newFilter('haveModuleWithFeatures', [function () {
      return function (values) {
         return ...;
      }
   ]);
   ```

6. **newModule(module, options)**
   - this function creates a module in your angular app
   ```javascript
   factory.newModule('myModule', {
      externalDeps: [/*external scripts needed in this module, ex: jquery, dojo, angular-ngMask, etc...*/
         'assets/libs/externalScript1.js',
		 'assets/libs/externalScript2.js'
      ],
      angularModules: [/*angular modules that depends on this module*/
         'ngMask', 'ngResources'
      ],
      internalDeps: [/*internal scripts needed in this module, ex: directives, filters, controllers, etc...*/
         'app/mymodule/directives/my-directives.js'
      ],
      config: [/*angular config block for this module*/
         'ngMaskConfig', function(ngMaskConfig){
            ...
         }
      ],
      run: [/*angular run block for this module*/
         '$rootScope', function($rootScope){
            ...
         }
      ],
      envJsPath: 'app/{module}/env/{module}-env.js', // path to module env settings, if null the load env is ignored
      useRestangular: true/false, // if true it will a restangular factory for a module named [module]RestService, e.g.: myModuleRestService. It'll be created if environment settings will has apiUrlBase property.
	  envSettingsName: 'envSettings' // contant name for the global environment settings, it's used as complement to envJsPath.
   });
   ```

6. **loadModules(urlOrModules, options)**
   * this function loads all modules returned by the response of the called url. It's recomended if your app has modules that are dynamicaly loaded. The fist param can be a list of modules.
   * options:
   - ignoredModules: list of modules to ignore
   - appJsPath: path to app.js module
   - onloadmodule: event dispatch when module is loaded
   - onfinish: event dispatch when all modules are loaded
   ```javascript
   factory.loadModules('myModules.json', {
      ignoredModules: ['common'],
      appJsPath: 'app/{module}/app.js',
      onloadmodule: function (module, moduleEnvSettings) {
         // event called when it finishes loading each module
      },
      onfinish: function (modules) {
         // event called when it finishes loading all modules
      }
   });
   
   Or
   
   factory.loadModules(['myModule1', 'myModule1'], {
      appJsPath: 'app/{module}/app.js',
      onloadmodule: function (module, moduleEnvSettings) {
         // event called when it finishes loading each module
      },
      onfinish: function (modules) {
         // event called when it finishes loading all modules
      }
   });
   
   // myModules.json:
   define(function(){return ['common', 'security', 'billing']};);
   ```
   - recommended use newModule in your app.js

6. **getFileVersion(file)**
   * this function translate the original file to the deployed file, using version.json mapping.