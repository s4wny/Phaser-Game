(function(){
    window.SplashState = function(){};

    var map;
    var groundLayer;
    var player;
    var cursors;
    var isJumping = false;

    var PLAYER_MAX_SPEED = 350;
    var PLAYER_ACCELERATION = 1000;
    var PLAYER_JUMP_SPEED = -300;
    var PLAYER_DRAG = 1000;
    var PLAYER_SIZE = {
        sprite : {w: 72, h:97}
    };


    SplashState.prototype = {
        preload : function() {
            game.load.tilemap('tilemap', 'assets/levels/1.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.image('tiles', 'assets/tiles/base.png');

            game.load.spritesheet('player', 'assets/p1_walk.png', PLAYER_SIZE.sprite.w, PLAYER_SIZE.sprite.h, 11);
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
                player.body.acceleration.x = -PLAYER_ACCELERATION;
            }
            if(rightInputIsActive()) {
                player.body.acceleration.x = PLAYER_ACCELERATION;
            }
            if(upInputIsActive() && !isJumping) {
                player.body.velocity.y = PLAYER_JUMP_SPEED;
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
        game.stage.backgroundColor = 0xd0f4f7;

        map = game.add.tilemap('tilemap');
        map.addTilesetImage('tiles_spritesheet_fixed', 'tiles');

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
        var walk = player.animations.add('walk');
        player.animations.play('walk', 15, true);

        game.physics.enable(player);
        game.physics.arcade.gravity.y = 350;

        with(player.body) {
            bounce.y = 0.3;
            linearDamping = 1;
            collideWorldBounds = true;
            drag.setTo(PLAYER_DRAG, 0);
            maxVelocity.setTo(PLAYER_MAX_SPEED, PLAYER_MAX_SPEED*10);

            var subtractWidth = 28;
            var subtractHeight = 10;
            setSize(PLAYER_SIZE.sprite.w - subtractWidth, PLAYER_SIZE.sprite.h - subtractHeight, subtractWidth/2, subtractHeight);
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