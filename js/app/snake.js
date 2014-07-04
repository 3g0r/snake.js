/**
 * Created with JetBrains PhpStorm.
 * User: egor
 * Date: 03.07.14
 * Time: 22:36
 * To change this template use File | Settings | File Templates.
 */
/**@requires App*/
/*jsHint*/
/*global App*/
/**
 * left = 0
 * up = 1
 * right = 2
 * down = 3
 * */
App.classes.Sanke = (function ( Body ) {

    'use strict';

    var Snake = function ( coordinates ) {
        if ( coordinates ) {
            this.rendered = true;
            this.push( new Body( coordinates ) );
            this.head.direction = parseInt( Math.random() * 1000, 10 ) % 4;
            this.foodQueue = new Snake();
        }
    }.extends( Array );

    Snake.prototype.__defineGetter__( 'head', function () {
        return this[0];
    } );

    Snake.prototype.__defineGetter__( 'tail', function () {
        return this[this.length - 1];
    } );

    Snake.prototype.eat = function ( food ) {
        this.foodQueue.push( new Body( food.coordinates ) );
    };

    Snake.prototype.move = function ( limitW, limitH ) {
        var head = this.head,
            direction = head.direction,
            tail = this.foodQueue.length && this.tail.x == this.foodQueue.head.x && this.tail.y == this.foodQueue.head.y && this.foodQueue.shift();
        this.forEach( function ( item ) {
            if ( item != head && item.x == head.x && item.y == head.y ) {
                throw new App.Error( '' );
            }
            switch ( item.direction ) {
                case 0:/*left*/
                    item.x--;
                    break;
                case 1:/*top*/
                    item.y--;
                    break;
                case 2:/*right*/
                    item.x++;
                    break;
                case 3:/*down*/
                    item.y++;
                    break;
            }
            item.x < 0 && (item.x = limitW) ||
            item.y < 0 && (item.y = limitH) ||
            item.x >= limitW && (item.x = 0) ||
            item.y >= limitH && (item.y = 0);
            var nextDirection = item.direction;
            item.direction = direction;
            direction = nextDirection;
        } );
        if ( tail ) {
            tail.direction = direction;
            this.push( tail );
        }
        this.rendered = true;
    };

    Snake.prototype.changeDirection = function ( direction ) {
        this.rendered &&
        (this.head.direction + 2) % 4 != direction && (this.head.direction = direction);
        this.rendered = false;
    };

    return Snake;

})( (function () {
        return function ( coordinates ) {
            this.direction = 0;
        }.extends( App.classes.GDCoordinate );
    })() );