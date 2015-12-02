var
    game = new Phaser.Game(1000, 700, Phaser.AUTO, 'game'),
    BootstrapState = function() {},
    settings = {
        PLAYER: {
            MAX_SPEED: 350,
            ACCELERATION: 1000,
            JUMP_SPEED: -300,
            DRAG: 1000,
            BOUNCE: 0.5,
            SIZE: {
                W: 72,
                H: 97
            }
        },

        COLOR: {
            MENU_BG: 0x2c3e50,
            GAME_BG: 0xd0f4f7
        },

        NUMBER_OF_LEVELS: 3,
    },
    global = {
        startTime: null, // Set by Game.js when uses starts level 1
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

/**
 * Center text to a whole pixel to avoid
 * subpixels which occurs if you just use
 * `text.anchor.setTo(0.5)` which leads to blurry text.
 */
function centerText(text) {
    text.anchor.x = Math.round(text.width * 0.5) / text.width;
    return text;
}