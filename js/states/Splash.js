(function(){
    window.SplashState = function(){};

    var splashScreen;
    var loadingBar;
    var statusText;

    SplashState.prototype = {
        init: function() {
            splashScreen = game.make.sprite(0, 0, 'splashScreen');
            splashScreen.height = game.height;
            splashScreen.width = game.width;

            statusText = game.make.text(game.world.centerX, game.height * 3/4 - 20, "Loading...", {fill: 'white'});
            statusText = centerText(statusText);

            loadingBar = game.make.sprite(game.world.centerX, game.height * 3/4 + 50, 'loadingBar');
            loadingBar.anchor.set(0.5);
        },

        preload : function() {
            // Loading bar
            game.add.existing(splashScreen);
            game.add.existing(loadingBar);
            game.add.existing(statusText);
            game.load.setPreloadSprite(loadingBar);

            // States
            game.load.script('Game', 'js/states/Game.js');
            game.load.script('GameMenu', 'js/states/GameMenu.js');

            // Maps
            for(var i = 1; i <= settings.NUMBER_OF_LEVELS; i++) {
                game.load.tilemap('tilemap'+ i, 'assets/levels/'+ i +'.json', null, Phaser.Tilemap.TILED_JSON);
            }
            game.load.image('tiles', 'assets/tiles/base.png');

            // Player
            game.load.spritesheet('player', 'assets/sprites/p1_walk.png', settings.PLAYER.SIZE.W, settings.PLAYER.SIZE.H, 11);
            game.load.image('playerIdle', 'assets/sprites/p1_front.png');
        },

        create : function() {
            with(game.state) {
                add('Game', GameState);
                add('GameMenu', GameMenuState);
            }

            statusText.text = "Ready!";
            statusText = centerText(statusText);

            setTimeout(function() {
                game.state.start('Game', true, false, 3);
            }, /*40*/0);
        }
    }
})();