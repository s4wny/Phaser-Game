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

            statusText = game.make.text(game.world.centerX, game.height * 3/4 - 10, "Loading...", {fill: 'white'});
            statusText.anchor.set(0.5);

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

            // Map
            game.load.tilemap('tilemap', 'assets/levels/1.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image('tiles', 'assets/tiles/base.png');

            // Player
            game.load.spritesheet('player', 'assets/sprites/p1_walk.png', settings.PLAYER.SIZE.W, settings.PLAYER.SIZE.H, 11);
        },

        create : function() {
            with(game.state) {
                add('Game', GameState);
                add('GameMenu', GameMenuState);
            }

            statusText.text = "Ready!";

            setTimeout(function() {
                game.state.start('Game');
            }, 400);
        }
    }
})();