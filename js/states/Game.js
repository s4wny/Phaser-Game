(function(){
    window.GameState = function(){};

    var map;
    var groundLayer;
    var player;
    var isJumping = false;
    var currentLevel;

    GameState.prototype = {
        init : function(level) {
            currentLevel = level;
        },

        create : function() {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            initializeWorld();
            initializePlayer();

            game.input.keyboard.addKeyCapture([
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN
            ]);
        },

        update : function() {
            game.physics.arcade.collide(player, groundLayer);


            player.body.acceleration.x = 0;
            

            if(leftInputIsActive()) {
                player.body.acceleration.x = -settings.PLAYER.ACCELERATION;
                player.scale.x = -1
            }
            if(rightInputIsActive()) {
                player.body.acceleration.x = settings.PLAYER.ACCELERATION;
                player.scale.x = 1;
            }
            if(upInputIsActive() && !isJumping) {
                player.body.velocity.y = settings.PLAYER.JUMP_SPEED;
                isJumping = true;
            }

            onTheGround = player.body.onFloor();
            if(onTheGround) {
                isJumping = false;
            }
        },

        /**
         * 
         */
        render: function() {
            //game.debug.body(player);
        }
    }


    // ---------------------------------------------------------------
    //  Helpers
    // ---------------------------------------------------------------

    /**
     * Load tilemap, set physics, resize
     */
    function initializeWorld() {
        game.stage.backgroundColor = settings.COLOR.GAME_BG;

        map = game.add.tilemap('tilemap'+ currentLevel);
        map.addTilesetImage('tiles_spritesheet_fixed', 'tiles');

        // Ground collision
        map.setCollision([129, 104, 105]);

        // Goal collision
        // 46, 65, 58
        map.setTileIndexCallback(46, function(s, t) {
            if(currentLevel == settings.NUMBER_OF_LEVELS) {
                // Win thing
            }
            else {
                game.state.start('Game', true, false, currentLevel+1);
            }
        }, this);

        
        groundLayer = map.createLayer('ground');

        // This resizes the game world to match the layer dimensions
        groundLayer.resizeWorld();
    }

    /**
     * Add sprite, animation, enable physics, etc
     */
    function initializePlayer() {
        player = game.add.sprite(200, 100, 'player');
        player.anchor.setTo(0.5, 1);
        
        var walk = player.animations.add('walk');
        player.animations.play('walk', 15, true);

        game.physics.enable(player);
        game.physics.arcade.gravity.y = 350;

        with(player.body) {
            bounce.y = 0.5;
            collideWorldBounds = true;
            drag.setTo(settings.PLAYER.DRAG, 0);
            maxVelocity.setTo(settings.PLAYER.MAX_SPEED, settings.PLAYER.MAX_SPEED*10);
            setSize(settings.PLAYER.SIZE.W - 28, settings.PLAYER.SIZE.H - 10, 0, 0);
        }

        game.camera.follow(player);
    }

    function rightInputIsActive() {
        var threeQuarters = game.width / 2 + game.width / 4;

        isActive  = false;
        isActive  = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
        isActive |= game.input.activePointer.isDown && game.input.activePointer.x > threeQuarters;
        return isActive;
    }

    function leftInputIsActive() {
        isActive  = false;
        isActive  = game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
        isActive |= game.input.activePointer.isDown && game.input.activePointer.x < game.width / 4;
        return isActive;
    }

    function upInputIsActive() {
        isActive  = false;
        isActive  = game.input.keyboard.isDown(Phaser.Keyboard.UP);
        isActive |= game.input.activePointer.isDown && game.input.activePointer.y < game.width / 4;
        return isActive;
    }
})();