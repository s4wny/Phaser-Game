var
    game = new Phaser.Game(1000, 700, Phaser.AUTO, 'game'),
    BootstrapState = function() {};


BootstrapState.prototype = {
    preload: function() {
        game.load.script('js/states/Splash');
    },

    create: function() {
        game.state.add('Splash', SplashState);
        game.state.start('Splash');
    }
}

game.state.add('Bootstrap', BootstrapState);
game.state.start('Bootstrap');

