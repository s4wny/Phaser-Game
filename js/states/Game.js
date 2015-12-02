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

            if(level == 1) {
                global.startTime = new Date().getTime();
            } 
        },

        create : function() {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            initializeWorld();
            initializePlayer();

            // Goal collision, 46, 65, 58
            map.setTileIndexCallback(46, function(s, t) {
                if(currentLevel == settings.NUMBER_OF_LEVELS) {
                    game.state.start('Win');
                }
                else {
                    game.state.start('Game', true, false, currentLevel+1);
                }
            }, this);

            game.input.keyboard.addKeyCapture([
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.SPACEBAR
            ]);
        },

        update : function() {
            game.physics.arcade.collide(player, groundLayer);

            if(player.body.velocity.x == 0 && Math.abs(player.body.velocity.y) < 2) {
                player.animations.stop();
            }
            else {
                player.animations.play('walk', 15, true);
            }

            handlePlayerMovement();
            restartMapHook();
        },

        /**
         * Useful for visual debuging
         */
        render: function() {
            //game.debug.body(player);
        }
    }


    function handlePlayerMovement() {
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
    }

    /**
     * Restart map on spacebar or double click
     */
    function restartMapHook() {
        // 
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            game.state.start('Game', true, false, currentLevel);
        }

        game.input.onTap.add(function(pointer, isDoubleClick) {
            if(!isDoubleClick)
                return;

            game.state.start('Game', true, false, currentLevel);
        });
    }

    /**
     * Load tilemap, set physics, resize
     */
    function initializeWorld() {
        game.stage.backgroundColor = settings.COLOR.GAME_BG;

        map = game.add.tilemap('tilemap'+ currentLevel);
        map.addTilesetImage('tiles_spritesheet_fixed', 'tiles');

        // Ground collision
        map.setCollision([129, 104, 105]);

        
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
            bounce.y = settings.PLAYER.BOUNCE;
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