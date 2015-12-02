(function(Phaser) {
    var game = new Phaser.Game(1000, 700, Phaser.AUTO, 'game', {
        preload: preload,
        create: create,
        update: update
    });
    
    var map;
    var groundLayer;
    var player;
    var cursors;
    var isJumping = false;

    var PLAYER_MAX_SPEED = 350;
    var PLAYER_ACCELERATION = 1000;
    var PLAYER_JUMP_SPEED = -300;
    var PLAYER_DRAG = 1000;
    
    function preload() {
        game.load.tilemap('tilemap', 'assets/levels/1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/tiles/base.png');
    
        game.load.spritesheet('player', 'assets/p1_walk.png', 72, 97, 11);
    }
    
    
    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        initializeWorld();
        initializePlayer();
    
        game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);
    }
    
    function update() {
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
    
        map.setCollision([103, 104, 128]);
    
        
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

})(Phaser);