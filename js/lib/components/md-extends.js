/**
 * Created with JetBrains PhpStorm.
 * User: egor
 * Date: 12.05.14
 * Time: 15:20
 * To change this template use File | Settings | File Templates.
 */
/*jsHint*/
/*global App*/

(function () {
    'use strict';

    function makeSuper( parent ) {
        var constructorName = parent.prototype.constructor.name;
        parent = parent.prototype;
        return function ( children, methodName ) {
            var args = arguments;
            var method = parent[methodName];
            if ( !method || !App.isFunction( method ) ) {
                throw new Error( constructorName.concat( '.', methodName, '() is not exists' ) );
            }
            if ( args.length === 4 && args[3] && Array.isArray( args[2] ) ) {
                args = arguments[2];
            } else {
                args = Array.prototype.slice.call( args, 2 );
            }
            method.apply( children, args );
        };
    }

    this.prototype.extends = function ( parent ) {
        for ( var key in parent ) {
            if ( !this[key] ) {
                this[key] = parent[key];
            }
        }
        return (function ( children ) {

            function Parent() {
            }

            Parent.prototype = parent.prototype;

            function Children() {
                parent.apply( this, App.prepareArguments( arguments ) );
                children.apply( this, App.prepareArguments( arguments ) );
            }

            Children.prototype = new Parent();

            Children.super = makeSuper( parent );
            Children._super = parent;

            return Children;
        })( this );
    };

}).call( App.Function );