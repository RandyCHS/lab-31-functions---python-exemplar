//  Constants
let ENEMY_COLS = 4
let ENEMY_ROWS = 3
let FOOD_DROP_INTERVAL = 5000
let FOOD_VELOCITY = 50
let MAX_FOOD_SCORE = 1000
let MAX_SPRITE_DISTANCE = 200
let PROJECTILE_VELOCITY = -25
//  Global variables
let hero_sprite : Sprite = null
//  Functions
function calculate_score(food: Sprite): number {
    //  Calculate distance between two sprites (Pythagorean theorem).
    //  Calculate percentage out of maximum possible distance (200 pixels).
    //  Multiply percentage by maximum score.
    return (MAX_SPRITE_DISTANCE - Math.sqrt((food.x - hero_sprite.x) ** 2 + (food.y - hero_sprite.y) ** 2)) / MAX_SPRITE_DISTANCE * MAX_FOOD_SCORE
}

//  Simplified version
function create_enemies(rows: number, columns: number) {
    let enemy_image = assets.image`coin`
    let x = (screen.width - enemy_image.width * columns) / 2
    let y = enemy_image.height / 2
    //  Instead of looping here, call the enhanced version.
    create_sprite_grid(rows, columns, enemy_image, x, y, SpriteKind.Enemy, 0, 0, 0, 0)
}

//  Enhanced version
function create_sprite_grid(rows: number, columns: number, image: Image, start_x: number, start_y: number, kind: number, vx: number, vy: number, padding_x: number, padding_y: number) {
    let s: Sprite;
    let x = start_x
    let y = start_y
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            s = sprites.create(image, kind)
            s.setPosition(x, y)
            x += image.width + padding_x
        }
        x = start_x
        y += image.height + padding_y
    }
}

function create_hero_sprite() {
    
    hero_sprite = sprites.create(assets.image`hero`, SpriteKind.Player)
    hero_sprite.setPosition(80, 100)
    hero_sprite.setFlag(SpriteFlag.StayInScreen, true)
    controller.moveSprite(hero_sprite)
    info.setScore(0)
}

//  Event handlers
controller.A.onEvent(ControllerButtonEvent.Pressed, function fire_projectile() {
    let projectile = sprites.createProjectileFromSprite(assets.image`projectile`, hero_sprite, 0, PROJECTILE_VELOCITY)
})
game.onUpdateInterval(FOOD_DROP_INTERVAL, function drop_food() {
    let food = sprites.createProjectileFromSide(assets.image`apple`, 0, FOOD_VELOCITY)
    food.setKind(SpriteKind.Food)
    food.x = Math.randomRange(8, 152)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Food, function on_projectile_food_overlap(projectile: Sprite, food_sprite: Sprite) {
    info.changeScoreBy(calculate_score(food_sprite))
    projectile.destroy()
    food_sprite.destroy(effects.spray, 250)
})
//  on start
create_hero_sprite()
create_enemies(ENEMY_ROWS, ENEMY_COLS)
