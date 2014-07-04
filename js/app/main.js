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
(function () {
    var game = new App.classes.Game( {
        liveFoodColor      : '#161DA2',
        weakFoodColor      : '#B9A13F',
        snakeColor         : '#000',
        width              : App.screenWidth - 25,
        height             : App.screenHeight - 30,
        canvas             : App.document.getElementById( 'canvas' ),
        snakeSize          : 10,
        expiredFoodInterval: 3000,
        foodCreatedInterval: 1500,
        renderSpeed        : 50
    } );

    var timeline = App.setInterval( function () {
        if ( !game.nextState() ) {
            App.clearInterval( timeline );
            game.renderScoreScreen();
        }
    }, 50 );
})();