/**
 * Created with JetBrains PhpStorm.
 * User: egor
 * Date: 03.07.14
 * Time: 22:36
 * To change this template use File | Settings | File Templates.
 */
/**@requires App*/
/*jsHInt*/
/*global App*/

App.classes.Food = (function () {
    'use strict';
    function Food( coordinates, expiredInterval, beforeDie, afterLive ) {
        this.expiredInterval = expiredInterval;
        this.coordinates = coordinates;
        this.afterLive = afterLive;
        this.beforeDie = beforeDie;
        this.liveRoad = [
            App.setTimeout( Food.setWeak.bind( this ), this.expiredInterval * 0.75 ),
            App.setTimeout( Food.die.bind( this ), this.expiredInterval )
        ];
    }

    Food.prototype.destroy = function () {
        this.liveRoad.forEach( function ( item ) {
            App.clearTimeout( item );
        } );
        delete this.coordinates;
        delete this.afterLive;
        delete this.beforeDie;
    };

    Food.setWeak = function () {
        this.beforeDie.call( null, this );
    };

    Food.die = function () {
        this.afterLive.call( null, this );
    };

    return Food;
})();