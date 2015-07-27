'use strict';

define(['ciandt-components-factory'], function (factory) {
	// requirejs plugin to load versioned script
	return {
		//example: ver!url
		load: function (name, req, onLoad) {
		    req(factory.getFileVersion(name), function () {
		        onLoad(mod);
		    });
		}
	};
});