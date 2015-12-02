var
    game = new Phaser.Game(1000, 700, Phaser.AUTO, 'game'),
    BootstrapState = function() {},
    settings = {
        PLAYER: {
            MAX_SPEED: 350,
            ACCELERATION: 1000,
            JUMP_SPEED: -300,
            DRAG: 1000,
            SIZE: {
                W: 72,
                H: 97
            }
        }
    };


BootstrapState.prototype = {
    preload: function() {
        game.load.image('splashScreen', 'assets/gfx/splash.png');
        game.load.image('loadingBar', 'assets/gfx/loadingBar.png');
        game.load.script('Splash', 'js/states/Splash.js');
    },

    create: function() {
        game.state.add('Splash', SplashState);
        game.state.start('Splash');
    }
}

game.state.add('Bootstrap', BootstrapState);
game.state.start('Bootstrap');

