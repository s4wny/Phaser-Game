(function(){
    window.WinState = function(){};

    WinState.prototype = {
        create : function() {
            var winScreen = game.add.sprite(0, 0, 'winScreen');
            winScreen.height = game.height;
            winScreen.width = game.width;

            var timeMs = new Date().getTime() - global.startTime;
            var timeS = Math.round(timeMs/1000);

            var text = game.add.text(game.width/2, game.height - 40, "(It took you "+ timeS +" seconds to win)", {
                fill: 'black',
                fontSize: 18
            });
            text = centerText(text);
        }
    }
})();