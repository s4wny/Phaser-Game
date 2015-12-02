(function(){
    window.WinState = function(){};

    WinState.prototype = {
        create : function() {
            winScreen = game.add.sprite(0, 0, 'winScreen');
            winScreen.height = game.height;
            winScreen.width = game.width;
        }
    }
})();