/**
 * Created with JetBrains PhpStorm.
 * User: egor
 * Date: 04.07.14
 * Time: 14:04
 * To change this template use File | Settings | File Templates.
 */
/**@requires App*/
/*jsHInt*/
/*global App*/

App.classes.Game = (function () {
    'use strict';
    function Game( settings ) {
        this.startAt = new App.Date();
        this.settings = settings;
        this._foods = {};
        App.Object.defineProperty( this._foods, 'length', {
            enumerable  : false,
            configurable: false,
            writable    : true,
            value       : 0
        } );

        this.liveFoodColor = App.classes.GDColor.parse( settings.liveFoodColor );
        this.weakFoodColor = App.classes.GDColor.parse( settings.weakFoodColor );
        this.snakeColor = App.classes.GDColor.parse( settings.snakeColor );

        this._initGD();
        this._createSnake();
        this._createFood = Game._createFood.bind( this );
        this.startFoodFactory();

        App.onkeydown = Game.changeSnakeDirection.bind( this );
    }

    Game.prototype._initGD = function () {
        this.gd = new App.classes.GD( this.settings.canvas, this.settings.width, this.settings.height, this.settings.snakeSize );
    };

    Game.prototype._getRandomCoordinate = function () {
        return new App.classes.GDCoordinate(
            this.gd.randomX( this.settings.snakeSize ),
            this.gd.randomY( this.settings.snakeSize )
        );
    };

    Game.prototype._createSnake = function () {
        this.snake = new App.classes.Sanke( this._getRandomCoordinate() );
    };

    Game._createFood = function () {
        var coordinates;
        while ( !this._isAllowedCoordinates( coordinates = this._getRandomCoordinate() ) );
        this._foods[this._getIdByCoordinates( coordinates )] = new App.classes.Food(
            coordinates,
            this.settings.expiredFoodInterval,
            this._beforeFoodDie,
            this._afterFoodLive
        );
        this.gd.setFillColor( this.liveFoodColor );
        this.gd.drawRect( coordinates );
        this.gd.setFillColor( this.snakeColor );
    };

    Game.prototype._isAllowedCoordinates = function ( coordinates ) {
        var id = this._getIdByCoordinates( coordinates );
        return !this._foods[id] && this.snake.map(function ( item ) {
            return this._getIdByCoordinates( item ) === id;
        }, this ).indexOf( true ) === -1;
    };

    Game.prototype.startFoodFactory = function () {
        this._beforeFoodDie = Game._beforeFoodDie.bind( this );
        this._afterFoodLive = Game._afterFoodLive.bind( this );
        this._foodFactory = App.setInterval( this._createFood, this.settings.foodCreatedInterval );
    };

    Game.prototype.stopFoodFactory = function () {
        App.clearInterval( this._foodFactory );
    };

    Game.prototype.nextState = function () {
        var tailX = this.snake.tail.x, tailY = this.snake.tail.y;
        try {
            this.snake.move( this.gd.width, this.gd.height );
        } catch ( error ) {
            this.gameOver();
            return false;
        }
        if ( this.snake.tail.x != tailX || this.snake.tail.y != tailY ) {
            this.gd.clearRect( tailX, tailY );
        }
        if ( !this.snakeEat() ) {
            this.gd.drawRect( this.snake.head );
        }
        return true;
    };

    Game.prototype.renderScoreScreen = function () {
        App.alert( 'Game Over!\nYour score: '.concat( this.getScore(), '\nAlive time: ', this.getAliveTime(), ' s' ) );
    };

    Game.prototype.getScore = function () {
        var aliveTime = this.getAliveTime();
        return Math.floor( this.snake.length * 1000 / aliveTime + aliveTime * 3 * 100 / 60 );
    };

    Game.prototype.getAliveTime = function () {
        return Math.floor( ((new Date()).getTime() - this.startAt.getTime()) / 1000 );
    };

    Game.prototype.gameOver = function () {
        this.stopFoodFactory();

    };

    Game.prototype._getIdByCoordinates = function ( coordinates ) {
        return '(x:'.concat( coordinates.x, ',y:', coordinates.y, ')' );
    };

    Game.prototype.snakeEat = function () {
        var __id = this._getIdByCoordinates( this.snake.head );
        if ( !this._foods[__id] ) {
            return false;
        }
        this.snake.eat( this._foods[__id] );
        this._foods[__id].destroy();
        delete this._foods[__id];
        this._createFood();
        return true;
    };

    Game.changeSnakeDirection = function ( event ) {
        event = App.event ? App.event : event;
        if ( event.keyCode === 116 ) {
            return true;
        }
        if ( 37 <= event.keyCode && 40 >= event.keyCode ) {
            this.snake.changeDirection( event.keyCode % 37 );
        }
        return false;
    };

    Game._beforeFoodDie = function ( food ) {
        this.gd.setFillColor( this.weakFoodColor );
        this.gd.drawRect( food.coordinates );
        this.gd.setFillColor( this.snakeColor );
    };

    Game._afterFoodLive = function ( food ) {
        delete this._foods[this._getIdByCoordinates( food.coordinates )];
        this.gd.clearRect( food.coordinates );
    };

    return Game;
})();
