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
        this._initFoodFactory = Game._initFoodFactory.bind( this );
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

    Game._initFoodFactory = function () {
        var food = new App.classes.Food(
            this._getRandomCoordinate(),
            this.settings.expiredFoodInterval,
            this._beforeFoodDie,
            this._afterFoodLive
        );
        food.__id = this._foods.length++;
        this._foods[food.__id] = food;
        this.gd.setFillColor( this.liveFoodColor );
        this.gd.drawRect( food.coordinates );
        this.gd.setFillColor( this.snakeColor );
    };

    Game.prototype.startFoodFactory = function () {
        this._beforeFoodDie = Game._beforeFoodDie.bind( this );
        this._afterFoodLive = Game._afterFoodLive.bind( this );
        this._foodFactory = App.setInterval( this._initFoodFactory, this.settings.foodCreatedInterval );
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
        App.alert( 'Game Over!\nYour score: '.concat( this.snake.length.toString() ) );
    };

    Game.prototype.gameOver = function () {
        this.stopFoodFactory();

    };

    Game.prototype.snakeEat = function () {
        var foodC, head = this.snake.head;
        for ( var key in this._foods ) {
            foodC = this._foods[key].coordinates;
            if ( foodC.x != head.x || foodC.y != head.y ) {
                continue;
            }
            this.snake.eat( this._foods[key] );
            this._foods[key].destroy();
            delete this._foods[key];
            return true;
        }
        return false;
    };

    Game.changeSnakeDirection = function ( event ) {
        event = App.event ? App.event : event;
        this.snake.changeDirection( event.keyCode % 37 );
        return false;
    };

    Game._beforeFoodDie = function ( food ) {
        this.gd.setFillColor( this.weakFoodColor );
        this.gd.drawRect( food.coordinates );
        this.gd.setFillColor( this.snakeColor );
    };

    Game._afterFoodLive = function ( food ) {
        delete this._foods[food.__id];
        this.gd.clearRect( food.coordinates );
    };

    return Game;
})();
