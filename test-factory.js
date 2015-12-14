'use strict';

(function (factory) {
    var _result = factory();
    if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
        module.exports = _result;
    }
    return _result;
}(function() {
    if (!window.jd) {
        window.jd = {};
    }

    window.jd.testFactory = {
        newControllerTest: function() {
            var ctrlJs = ['app'], ctrlName;
            var i=0;

            if (typeof arguments[i+1] === 'string') {
                if (typeof arguments[i] === 'string') {
                    ctrlJs.push(arguments[i]);
                } else {
                    ctrlJs = ctrlJs.concat(arguments[i]);
                }
                i++;
                ctrlName = arguments[i];
                i++;
            } else {
                ctrlName = arguments[i];
                i++;
            }

            var scope = {}, name = ctrlName, tests;

            if (typeof arguments[i] === 'object') {
                if (typeof arguments[i].test === 'function' && typeof arguments[i].name === 'string') {
                    tests = [arguments[i]];
                    i=5;
                } else {
                    scope = arguments[i];
                    i++;
                }
            }

            if (arguments.length >= i+1 && typeof arguments[i] === 'string') {
                name = arguments[i];
                i++;
            }

            if (arguments.length >= i+1) {
                if (typeof arguments[i] === 'function') {
                    tests = [arguments[i]];
                } else {
                    // is a array of tests
                    tests = arguments[i];
                }
            }

            if (!tests) {
                throw new Exception('TestMethods not found');
            }

            define(ctrlJs, function () {
                beforeEach(module('app'));

                var $controller;

                beforeEach(inject(function (_$controller_) {
                    $controller = _$controller_;
                }));

                describe(name, function() {
                    var controller;

                    beforeEach(inject(function(_$controller_){
                        controller = $controller(ctrlName, scope);
                    }));

                    // FIXME: avoid lost test reference
                    function _newFunc(test) {
                        return function() {
                            test.test(controller);
                        }
                    }

                    for (var test of tests) {
                        it(test.name, _newFunc(test));
                    }
                });
            });
        },

        newTestMethod: function(name, test) {
            return {'name': name, 'test': test};
        }
    };
    
    return window.jd;
}));