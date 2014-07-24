/**
 * Created with JetBrains PhpStorm.
 * User: egor
 * Date: 03.07.14
 * Time: 23:50
 * To change this template use File | Settings | File Templates.
 */
/**@requires App*/
/*jsHInt*/
/*global App*/
App.classes.GD = (function (undefined) {
    'use strict';

    function GD( canvas, width, height, step ) {
        step = step || 1;
        if ( width % step ) {
            width -= width % step;
        }
        if ( height % step ) {
            height -= height % step;
        }
        canvas.setAttribute( 'width', width );
        canvas.setAttribute( 'height', height );
        this.step = step;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.height = height / step;
        this.width = width / step;
        this.c2d = canvas.getContext( '2d' );
        this.canvasData = this.c2d.getImageData( 0, 0, this.canvasWidth, this.canvasHeight );
    }

    GD.prototype.setPixel = function ( coords, color ) {
        var index = (coords.x + coords.y * this.canvasWidth) * 4;

        this.canvasData.data[index + 0] = color.r;
        this.canvasData.data[index + 1] = color.g;
        this.canvasData.data[index + 2] = color.b;
        this.canvasData.data[index + 3] = color.a;
    };

    GD.prototype.drawRect = function ( x, y ) {
        this.c2d.fillRect(
            (x.x !== undefined ? x.x : x) * this.step,
            (x.y !== undefined ? x.y : y) * this.step,
            x.w || this.step,
            x.h || this.step
        );
    };

    GD.prototype.clearRect = function ( x, y ) {
        this.c2d.clearRect(
            (x.x !== undefined ? x.x : x) * this.step,
            (x.y !== undefined ? x.y : y) * this.step,
            x.w || this.step,
            x.h || this.step
        );
    };

    GD.prototype.setLineColor = function ( color ) {
        this.c2d.strokeStyle = App.classes.GDColor.parse( color );
        this.c2d.stroke();
    };

    GD.prototype.setFillColor = function ( color ) {
        this.c2d.fillStyle = App.classes.GDColor.parse( color ).toString();
        this.c2d.fill();
    };

    GD.prototype.randomX = function () {
        return parseInt( Math.random() * (this.canvasWidth.toString().length * 10), 10 ) % this.width;
    };

    GD.prototype.randomY = function () {
        return parseInt( Math.random() * (this.canvasHeight.toString().length * 10), 10 ) % this.height;
    };

    GD.prototype.draw = function () {
        this.c2d.putImageData( this.canvasData, 0, 0 );
    };

    return GD;

})();

(function ( construct, makeGetSet ) {
    'use strict';

    App.classes.GDColor = function ( r, g, b, a ) {
        construct( this, arguments );
    };

    App.classes.GDColor.parse = function ( color ) {
        if ( App.classes.GDColor.prototype.isPrototypeOf( color ) ) {
            return color;
        } else if ( typeof color === 'string' ) {
            color = color.replace( /([#\srgba\(\)])/g, '' );
            if ( (color = color.split( ',' )).length === 1 ) {
                return new App.classes.GDColor(
                    /([a-fA-F\d]{1,2})([a-fA-F\d]{1,2})([a-fA-F\d]{1,2})/
                        .exec( color[0] )
                        .slice( 1, 4 )
                        .map( function ( item ) {
                            return parseInt( item, 16 );
                        } )
                );
            }
            return new App.classes.GDColor( color );
        }
        return null;
    };

    App.classes.GDColor.prototype.toString = function () {
        return 'rgba('.concat( this.r || 0, ',', this.g || 0, ',', this.b || 0, ',', this.a || 255, ')' );
    };

    makeGetSet( App.classes.GDColor, 'r', 0 );
    makeGetSet( App.classes.GDColor, 'g', 1 );
    makeGetSet( App.classes.GDColor, 'b', 2 );
    makeGetSet( App.classes.GDColor, 'a', 3 );

    App.classes.GDCoordinate = function ( x, y, z ) {
        construct( this, arguments );
    };

    makeGetSet( App.classes.GDCoordinate, 'x', 0 );
    makeGetSet( App.classes.GDCoordinate, 'y', 1 );
    makeGetSet( App.classes.GDCoordinate, 'z', 2 );

    App.classes.GDRect = function ( x, y, w, h ) {
        construct( this, arguments );
    };

    makeGetSet( App.classes.GDRect, 'x', 0 );
    makeGetSet( App.classes.GDRect, 'y', 1 );
    makeGetSet( App.classes.GDRect, 'w', 2 );
    makeGetSet( App.classes.GDRect, 'h', 3 );

})(
    function ( context, args ) {
        if ( args.length === 1 && App.isArray( args[0] ) ) {
            args = args[0];
        }
        if ( args.length == 1 && !App.isArray( args[0] ) ) {
            for ( var key in context ) {
                context[key] = args[0][key];
            }
        } else {
            App.Array.prototype.forEach.call( args, function ( item, index ) {
                this[index] = item;
            }, context );
        }
    },
    function ( Class, fieldAlias, fieldName ) {
        Object.defineProperty( Class.prototype, fieldName, {
            enumerable  : false,
            configurable: false
        } );
        Object.defineProperty( Class.prototype, fieldAlias, {
            enumerable  : true,
            get: function () {
                return this[fieldName];
            },
            set: function ( value ) {
                this[fieldName] = value;
                return this;
            }
        } );
    } );