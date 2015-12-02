var game = new Phaser.Game(1000, 700, Phaser.AUTO, 'game', { preload: preload, create: create });

function preload() {
    game.load.tilemap('tilemap', 'assets/levels/1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tiles/base.png');
}

var map;
var layer;

function create() {
    game.stage.backgroundColor = 0xd0f4f7;

    map = game.add.tilemap('tilemap');
    map.addTilesetImage('tiles_spritesheet_fixed', 'tiles');
    
    //  Creates a layer from the World1 layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    layer = map.createLayer('ground');

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();
}