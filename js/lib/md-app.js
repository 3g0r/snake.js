/**
 * Created with JetBrains PhpStorm.
 * User: egor
 * Date: 01.07.14
 * Time: 5:43
 * To change this template use File | Settings | File Templates.
 */
/*jsHint*/
/*global window*/
/*global global*/

(function () {
    'use strict';
    this.App = this;
    /**@namespace*/
    this.App.classes = {};
    /**@namespace*/
    this.App.widgets = {};
}).call( this );

(function () {
    'use strict';
    if ( this.App.window ) {
        var w = this.App,
            d = this.App.document,
            e = d.documentElement,
            g = d.getElementsByTagName( 'body' )[0];

        this.App.__defineGetter__( 'screenWidth', function () {
            return w.innerWidth || e.clientWidth || g.clientWidth;
        } );

        this.App.__defineGetter__( 'screenHeight', function () {
            return w.innerHeight || e.clientHeight || g.clientHeight;
        } );
    }
}).call( this );