GameState = (game) ->

# Load images and sounds
GameState::preload = ->
    @game.load.image('ground', 'assets/gfx/ground.png')
    @game.load.image('player', 'assets/gfx/player.png')
    return

# Setup the example
GameState::create = ->
    @game.stage.backgroundColor = 0x4488cc

    @MAX_SPEED          = 500
    @ACCELERATION       = 1500
    @DRAG               = 1000
    @GRAVITY            = 2600
    @JUMP_SPEED         = -800


    @player = @game.add.sprite(@game.width / 2, @game.height / 2, 'player')

    # Enable physics on the player
    @game.physics.enable(@player, Phaser.Physics.ARCADE)
    @player.body.collideWorldBounds = true
    @player.body.maxVelocity.setTo(@MAX_SPEED, @MAX_SPEED * 10)
    @player.body.drag.setTo(@DRAG, 0)

    game.physics.arcade.gravity.y = @GRAVITY
    @jumping = false

    @ground = @game.add.group()

    for x in [0..@game.width] by 32
        do(x) =>
            # Add the ground blocks, enable physics on each, make them immovable
            groundBlock = @game.add.sprite(x, @game.height - 32, 'ground')
            @game.physics.enable(groundBlock, Phaser.Physics.ARCADE)
            groundBlock.body.immovable = true
            groundBlock.body.allowGravity = false
            @ground.add(groundBlock)

    @blockMidAir = @game.add.sprite(@game.width / 2, 0, 'ground')
    @game.physics.enable(@blockMidAir, Phaser.Physics.ARCADE)
    @blockMidAir.body.allowGravity       = true
    @blockMidAir.body.immovable          = false
    @blockMidAir.body.collideWorldBounds = true

    # Capture certain keys to prevent their default actions in the browser.
    # This is only necessary because this is an HTML5 game. Games on other
    # platforms may not need code like this.
    @game.input.keyboard.addKeyCapture [
        Phaser.Keyboard.LEFT
        Phaser.Keyboard.RIGHT
        Phaser.Keyboard.UP
        Phaser.Keyboard.DOWN
    ]

    # Just for fun, draw some height markers so we can see how high we're jumping
    @drawHeightMarkers()
    return


# This function draws horizontal lines across the stage
GameState::drawHeightMarkers = ->
    # Create a bitmap the same size as the stage
    bitmap = @game.add.bitmapData(@game.width, @game.height)

    # These functions use the canvas context to draw lines using the canvas API
    for y in [@game.height - 32..32] by -32
        do(y) =>
            bitmap.context.beginPath()
            bitmap.context.strokeStyle = 'rgba(255, 255, 255, 0.2)'
            bitmap.context.moveTo(0, y)
            bitmap.context.lineTo(@game.width, y)
            bitmap.context.stroke()

    @game.add.image(0, 0, bitmap)
    return

# The update() method is called every frame

GameState::update = ->
    # Collide the player with the ground
    xs = [@player, @ground, @blockMidAir]
    @game.physics.arcade.collide(xs, xs)

    if @leftInputIsActive()
        @player.body.acceleration.x = -@ACCELERATION
    else if @rightInputIsActive()
        @player.body.acceleration.x = @ACCELERATION
    else
        @player.body.acceleration.x = 0

    # Set a variable that is true when the player is touching the ground
    onTheGround = @player.body.touching.down

    # If the player is touching the ground, let him have 2 jumps
    if onTheGround
        @jumps = 2
        @jumping = false

    # Jump! Keep y velocity constant while the jump button is held for up to 150 ms
    if @jumps > 0 and @upInputIsActive(300)
        @player.body.velocity.y = @JUMP_SPEED
        @jumping = true

    # Reduce the number of available jumps if the jump input is released
    if @jumping and @upInputReleased()
        @jumps--
        @jumping = false

    return



# This function should return true when the player activates the "go left" control
# In this case, either holding the right arrow or tapping or clicking on the left
# side of the screen.
GameState::leftInputIsActive = ->
    isActive  = false
    isActive  = @input.keyboard.isDown(Phaser.Keyboard.LEFT)
    isActive |= @game.input.activePointer.isDown and @game.input.activePointer.x < @game.width / 4
    isActive



# This function should return true when the player activates the "go right" control
# In this case, either holding the right arrow or tapping or clicking on the right
# side of the screen.
GameState::rightInputIsActive = ->
    isActive  = false
    isActive  = @input.keyboard.isDown(Phaser.Keyboard.RIGHT)
    isActive |= @game.input.activePointer.isDown and @game.input.activePointer.x > @game.width / 2 + @game.width / 4
    isActive



# This function should return true when the player activates the "jump" control
# In this case, either holding the up arrow or tapping or clicking on the center
# part of the screen.
GameState::upInputIsActive = (duration) ->
    isActive  = false
    isActive  = @input.keyboard.downDuration(Phaser.Keyboard.UP, duration)
    isActive |= @game.input.activePointer.justPressed(duration + 1000 / 60) and @game.input.activePointer.x > @game.width / 4 and @game.input.activePointer.x < @game.width / 2 + @game.width / 4
    isActive



# This function returns true when the player releases the "jump" control
GameState::upInputReleased = ->
    released = false
    released = @input.keyboard.upDuration(Phaser.Keyboard.UP)
    released |= @game.input.activePointer.justReleased()
    released

game = new (Phaser.Game)(848, 450, Phaser.AUTO, 'game')
game.state.add('game', GameState, true)