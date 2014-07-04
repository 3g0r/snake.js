/**
 * Created with JetBrains PhpStorm.
 * User: egor
 * Date: 01.07.14
 * Time: 5:44
 * To change this template use File | Settings | File Templates.
 */
/*jsHint*/
/*global App*/

(function ( undefined ) {
    'use strict';

    App.prepareArguments = function ( args, start, end ) {
        return args.length ? App.Array.prototype.slice.call( args, start, end ) : undefined;
    };

})();

(function ( $, makeValidator, undefined ) {
    'use strict';

    App.isUndefined = makeValidator( undefined );

    App.isNull = makeValidator( null );

    App.isObject = makeValidator( App.Object );

    App.isArray = $ ? $.isArray : App.Array.isArray;

    App.isString = makeValidator( App.String );

    App.isFunction = $ ? $.isFunction : makeValidator( App.Function );

    App.isBoolean = makeValidator( App.Boolean );

    App.isNumeric = makeValidator( App.Number );

    App.isDate = makeValidator( App.Date );

    App.isError = makeValidator( App.Error );

    App.isRegExp = makeValidator( App.RegExp );

})( App.jQuery, (function ( $, undefined ) {
        if ( $ ) {
            return function ( ObjectConstructor ) {
                var validType;
                if ( ObjectConstructor === undefined ) {
                    validType = 'undefined';
                } else if ( ObjectConstructor === null ) {
                    validType = 'null';
                } else if ( ObjectConstructor === App.Date ) {
                    validType = 'date';
                } else if ( ObjectConstructor === App.Error ) {
                    validType = 'error';
                } else if ( ObjectConstructor === App.RegExp ) {
                    validType = 'regexp';
                } else {
                    return function ( expression ) {
                        return ObjectConstructor.prototype.isPrototypeOf( expression );
                    }
                }

                return function ( expression ) {
                    return $.type( expression ) === validType;
                };
            };

        }
        return function ( ObjectConstructor ) {
            var validator;
            if ( ObjectConstructor === undefined ) {
                validator = function ( expression ) {
                    return expression === undefined;
                };
            } else if ( ObjectConstructor === null ) {
                validator = function ( expression ) {
                    return expression === null;
                };
            } else if ( ObjectConstructor === App.Date || ObjectConstructor === App.Error || ObjectConstructor === App.RegExp ) {
                validator = function ( expression ) {
                    return !App.isNull( expression ) &&
                           App.isObject( expression ) &&
                           ObjectConstructor.prototype.isPrototypeOf( expression );
                };
            } else {
                validator = function ( expression ) {
                    return typeof expression === validator.validType;
                };

                validator.validType = typeof (new ObjectConstructor());
            }
            return validator;
        };
    })( App.jQuery ) );