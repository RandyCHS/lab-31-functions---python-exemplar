# Constants
ENEMY_COLS: number = 4
ENEMY_ROWS: number = 3
FOOD_DROP_INTERVAL: number = 5000
FOOD_VELOCITY: number = 50
MAX_FOOD_SCORE: number = 1000
MAX_SPRITE_DISTANCE: number = 200
PROJECTILE_VELOCITY: number = -25

# Global variables
hero_sprite: Sprite = None
enemy_image: Image = assets.image("""coin""")
# Functions
def calculate_score(food: Sprite):
    # Calculate distance between two sprites (Pythagorean theorem).
    # Calculate percentage out of maximum possible distance (200 pixels).
    # Multiply percentage by maximum score.
    return (MAX_SPRITE_DISTANCE - Math.sqrt(
        (food.x - hero_sprite.x)**2 + (food.y - hero_sprite.y)**2
    )) / MAX_SPRITE_DISTANCE * MAX_FOOD_SCORE

# Simplified version
def create_enemies(rows: number, columns: number):
    x: number = (screen.width - enemy_image.width * columns) / 2
    y: number = enemy_image.height / 2
    # Instead of looping here, call the enhanced version.
    create_sprite_grid(rows, columns, enemy_image, x, y, SpriteKind.enemy, 0, 0, 0, 0)

# Enhanced version
def create_sprite_grid(rows: number, columns: number, image: Image,
start_x: number, start_y: number, kind: number, vx: number, vy: number,
padding_x: number, padding_y: number):
    x: number = start_x
    y: number = start_y
    for r in range(rows):
        for c in range(columns):
            s: Sprite = sprites.create(image, kind)
            s.set_position(x, y)
            x += image.width + padding_x
        x = start_x
        y += image.height + padding_y

def create_hero_sprite():
    global hero_sprite
    hero_sprite = sprites.create(assets.image("""hero"""), SpriteKind.player)
    hero_sprite.set_position(80, 100)
    hero_sprite.set_flag(SpriteFlag.STAY_IN_SCREEN, True)
    controller.move_sprite(hero_sprite)
    info.set_score(0)

def drop_food():
    food = sprites.create_projectile_from_side(assets.image("""apple"""), 0, FOOD_VELOCITY)
    food.set_kind(SpriteKind.food)
    food.x = Math.random_range(8, 152)

def fire_projectile():
    projectile = sprites.create_projectile_from_sprite(assets.image("""projectile"""),
        hero_sprite, 0, PROJECTILE_VELOCITY)

# Event handlers
controller.A.on_event(ControllerButtonEvent.PRESSED, fire_projectile)

game.on_update_interval(FOOD_DROP_INTERVAL, drop_food)

def on_projectile_food_overlap(projectile: Sprite, food_sprite: Sprite):
    info.change_score_by(calculate_score(food_sprite))
    projectile.destroy()
    food_sprite.destroy(effects.spray, 250)
sprites.on_overlap(SpriteKind.projectile, SpriteKind.food, on_projectile_food_overlap)

# on start
create_hero_sprite()
create_enemies(ENEMY_ROWS, ENEMY_COLS)
