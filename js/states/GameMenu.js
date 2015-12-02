(function(){
    window.GameMenuState = function(){};

    GameMenuState.prototype = {
        create : function() {
            game.stage.backgroundColor = settings.COLOR.MENU_BG;

            text = game.add.text(game.world.centerX, 300, "Play!", {
                fill: 'white'
            });
            text = centerText(text);
        }
    }
})();