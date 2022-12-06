const my_canvas = document.getElementById('canvas_joc');
const ctx = my_canvas.getContext('2d');
const W = my_canvas.clientWidth;
const H = my_canvas.clientHeight;
const colors = ['#fff', '#0f0', '#00f', '#f00'];
const rockets = [];
const asteroids = [];
const BOUNDS = 40;
var player;
var is_paused = false;
const dx_s = [];
const dy_s = [];
const MAX_ASTEROIDS = 20;

class Asteroid {
    constructor() {
        this.health = Math.round(1 + Math.random() * 3);
        // TODO: ajusteaza viteza ca sa fie playable
        this.dx = 0.2 + Math.random() * 1;
        this.dy = 0.2 + Math.random() * 1;
        // this.dx = 3 + Math.random() * 1.5;
        // this.dy = 3 + Math.random() * 1.5;
        this.delete = false;
        let spawn_location = Math.round(Math.random() * 8);

    //      0  1
    //    7      2
    //    6      3
    //      5  4

        switch(spawn_location) {
            case 0:
                this.y = -BOUNDS;
                this.x = Math.random() * W/2;
                break;
            case 1:
                this.y = -BOUNDS;
                this.x = W/2 + Math.random() * W/2;
                this.dx *= -1;
                break;
            case 2:
                this.x = W + BOUNDS;
                this.y = Math.random() * H/2;
                this.dx *= -1;
                break;
            case 3:
                this.x = W + BOUNDS;
                this.y = H/2 + Math.random() * H/2;
                this.dx *= -1;
                this.dy *= -1;
                break;
            case 4:
                this.y = H + BOUNDS;
                this.x = W/2 + Math.random() * W/2;
                this.dx *= -1;
                this.dy *= -1;
                break;
            case 5:
                this.y = H + BOUNDS;
                this.x = Math.random() * W/2;
                this.dy *= -1;
                break;
            case 6:
                this.x = -BOUNDS;
                this.y = H/2 + Math.random() * H/2;
                this.dy *= -1;
                break;
            case 7:
                this.x = -BOUNDS;
                this.y = Math.random() * H/2;
                break;
        };

        this.r = 10 + this.health * 10;
        // this.r = 150 + this.health * 10;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = colors[this.health - 1];

        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 30px arial';
        ctx.fillText(`${this.health}`, this.x - 10, this.y + 10);
        ctx.closePath();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    hit() {
        this.health--;
        this.r = 10 + this.health * 10;
        if(this.health === 0)
            this.delete = true;
    }

    isColliding(other) {
        return ((this.x - other.x) ** 2 + (this.y - other.y) ** 2 <= (this.r + other.r) ** 2)
    }

    resolveCollision(other) {
        //TODO: Dupa ce termini si intelegi ce se intampla, redu codul incepand de aici
        // 1. Gaseste vectorii unitate normal si unitate tangential
        //! daca coliziunile se petrec in directii incorecte, vezi aici la normal.x si normal.y
        // var normal = {
        //     x: this.x - other.x,
        //     y: this.y - other.y,
        //     magnitude: Math.sqrt(this.x ** 2 + this.y ** 2)
        // };

        // var unit_normal = {
        //     x: normal.x / normal.magnitude,
        //     y: normal.y / normal.magnitude
        // }

        // //? Incearca sa intelegi ce se intampla aici
        // var unit_tangential = {
        //     x: -unit_normal.y,
        //     y: unit_normal.x
        // }
        var normal_vector = new Vector2D(this.x - other.x, this.y - other.y);
        normal_vector.normalize();
        var tangential_vector = new Vector2D(-normal_vector.y, normal_vector.x);

        // 2. Creaza vectorii viteza initiali
        // var velocity_this = {
        //     x: this.dx,
        //     y: this.dy,
        // };

        // var velocity_other = {
        //     x: other.dx,
        //     y: other.dy,
        // };
        var this_velocity = new Vector2D(this.dx, this.dy);
        var other_velocity = new Vector2D(other.dx, other.dy);

        // 3. Imparte vitezele in componente normale si tangentiale
        // Componentele normale sufera conservarea fortei
        // Componentele tangentiale sunt neafectate
        //? dot product -> (v1.x * v2.x) + (v1.y * v2.y)
        // var scalar_velocity_this_normal = unit_normal.x * velocity_this.x + unit_normal.y * velocity_this.y;
        // var scalar_velocity_other_normal = unit_normal.x * velocity_other.x + unit_normal.y * velocity_other.y;
        // var scalar_velocity_this_tangential = unit_tangential.x * velocity_this.x + unit_tangential.y * velocity_this.y;
        // var scalar_velocity_other_tangential = unit_tangential.x * velocity_other.x + unit_tangential.y * velocity_other.y;
        //? v_n = v.mag * 

        // 4. Calculeaza componenta normala a noilor viteze
        // var new_scalar_velocity_this_normal = 
        //     (scalar_velocity_this_normal * (this.health - other.health) + 2 * other.health * scalar_velocity_other_normal) / (this.health + other.health);
        // var new_scalar_velocity_other_normal =
        //     (scalar_velocity_other_normal * (other.health - this.health) + 2 * this.health * scalar_velocity_this_normal) / (this.health + other.health);

        // 5. Converteste vitezele scalare in vectori
        // var new_velocity_this_normal = {
        //     x: unit_normal.x * new_scalar_velocity_this_normal,
        //     y: unit_normal.y * new_scalar_velocity_this_normal
        // };

        // var new_velocity_other_normal = {
        //     x: unit_normal.x * new_scalar_velocity_other_normal,
        //     y: unit_normal.y * new_scalar_velocity_other_normal
        // };

        // var new_velocity_this_tangential = {
        //     x: unit_tangential.x * scalar_velocity_this_tangential,
        //     y: unit_tangential.y * scalar_velocity_this_tangential
        // };

        // var new_velocity_other_tangential = {
        //     x: unit_tangential.x * scalar_velocity_other_tangential,
        //     y: unit_tangential.y * scalar_velocity_other_tangential
        // };

        // 6. Compune noii vectori normali si tangentiali pentru a obtine noii vectori de viteza
        // var new_velocity_this = {
        //     x: new_velocity_this_normal.x + new_velocity_this_tangential.x,
        //     y: new_velocity_this_normal.y + new_velocity_this_tangential.y
        // };

        // var new_velocity_other = {
        //     x: new_velocity_other_normal.x + new_velocity_other_tangential.x,
        //     y: new_velocity_other_normal.y + new_velocity_other_tangential.y
        // };

        // 7. Atribuim asteroizilor noile viteze pe componentele x si y
        // this.dx = new_velocity_this.x;
        // this.dy = new_velocity_this.y;
        // other.dx = new_velocity_other.x;
        // other.dy = new_velocity_other.y;
    }
}

//TODO: Implementeaza clasa Vector2D de aici: http://www.danielsoltyka.com/programming/2010/05/30/c-vector2d-rectangle-classes/
class Vector2D {
    //? Se asuma ca originea vectorului e (0,0)
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize() {
        let magnitude = this.magnitude();
        if(magnitude) {
            this.x /= magnitude;
            this.y /= magnitude;
        }
    }

    dotProduct(other) {
        return this.x * other.x + this.y * other.y;
    }

    scale(scaling_factor) {
        this.x *= scaling_factor;
        this.y *= scaling_factor;
    }

    add_vector(other) {
        this.x += other.x;
        this.y += other.y;
    }
}

class Player {
    constructor() {
        this.x = W/2;
        this.y = H/2;
        this.rotation = 0;
        this.size = 15;
        this.max_speed = 24;
        this.acc = this.max_speed/8;
        this.speed_x = 0;
        this.speed_y = 0;
    }

    drawPlayer() {
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.fillStyle = '#a05fd0';
        ctx.moveTo(0, -1*this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-1*this.size, this.size);
        ctx.lineTo(0, -1*this.size);
        ctx.fill();
    }

    shoot() {
        rockets.push(new Rocket(this.x, this.y, this.rotation - Math.PI/2));
    }

    reduceSpeed() {
        let brake_speed = 0.1;
        if(this.speed_x > 0) {
            this.speed_x -= brake_speed;
        }
        if(this.speed_x < 0) {
            this.speed_x += brake_speed;
        }
        if(this.speed_y > 0) {
            this.speed_y -= brake_speed;
        }
        if(this.speed_y < 0) {
            this.speed_y += brake_speed;
        }
    }

    update() {
        this.x += this.speed_x;
        this.y += this.speed_y;
        if(this.x < 0) {
            this.x = W - 1;
        }
        if(this.x > W) {
            this.x = 0;
        }
        if(this.y < 0) {
            this.y = H - 1;
        }
        if(this.y > H) {
            this.y = 0;
        }
    }

    moveX(dx) {
        if(this.speed_x < this.max_speed && this.speed_x > this.max_speed*(-1))
            this.speed_x += dx;
    }

    moveY(dy) {
        if(this.speed_y < this.max_speed && this.speed_y > this.max_speed*(-1))
            this.speed_y += dy;
    }

    coords() {
        console.log(`x:${this.x}, y:${this.y}, dx:${this.speed_x}, dy${this.speed_y}`);
    }
}

class Rocket {
    constructor(x, y, rotation) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.r = 5;
        this.speed = 10;
        this.delete = false;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.speed * Math.cos(this.rotation);
        this.y += this.speed * Math.sin(this.rotation);
    }

    coords() {
        console.log(`x:${this.x}, y:${this.y}`);
    }
}

class GameHandler {
    static loadAsteroids() {
        if(asteroids.length < MAX_ASTEROIDS) {
            asteroids.push(new Asteroid());
        }
    }

    static drawAsteroids() {
        asteroids.forEach(asteroid => {
            asteroid.draw();
            asteroid.update();
        });
    }

    static drawRockets() {
        rockets.forEach(rocket => {
            rocket.draw();
            rocket.update();
        })
    }

    static isOutOfBounds(obj) {
        if(obj.x < -BOUNDS || obj.x > W + BOUNDS || obj.y < -BOUNDS || obj.y > H + BOUNDS) {
            return true;
        } else {
            return false;
        }
    }

    static unloadObjects(objArr) {
        for(let i = 0; i < objArr.length; i++) {
            if(GameHandler.isOutOfBounds(objArr[i]) || isNaN(objArr[i].x) || objArr[i].delete === true) {
                objArr.splice(i, 1);
            }
        }
    }

    static collisionAsteroidRocket() {
        for (let i = 0; i < asteroids.length; i++) {
            for(let j = 0; j < rockets.length; j++) {
                if(((asteroids[i].x - rockets[j].x) ** 2 + (asteroids[i].y - rockets[j].y) ** 2) <=
                (asteroids[i].r + rockets[j].r) ** 2) {
                    asteroids[i].hit();
                    rockets[j].delete = true;
                }
            }
        }
    }

    static collisionAsteroidAsteroid() {
        for(let i = 0; i < asteroids.length - 1; i++) {
            for(let j = i + 1; j < asteroids.length; j++) {
                if(asteroids[i].isColliding(asteroids[j])) {
                    console.log(`${i} is colliding with ${j}`);
                    asteroids[i].resolveCollision(asteroids[j]);
                }
            }
        }
    }
}

function init() {
    player = new Player();
    window.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
            // DEPLASARE
            case 37:
                // left
                player.moveX((-1)*player.acc);
                break;
            case 38:
                // up
                player.moveY((-1)*player.acc);
                break;
            case 39:
                // right
                player.moveX(player.acc);
                break;
            case 40:
                // down
                player.moveY(player.acc);
                break;

            // ROTIRE
            case 90:
                // rotire stanga -> z
                player.rotation -= 10 * Math.PI/180;
                break;

            case 67:
                // rotire dreapta -> c
                player.rotation += 10 * Math.PI/180;
                break;

            // LANSEAZA RACHETA -> x
            case 88:
                if(rockets.length < 3) {
                    player.shoot();
                }
                break;
        }
    });
    // Pause functionality
    my_canvas.addEventListener("click", (e) => {
        if(is_paused) {
            for(let i = 0; i < asteroids.length; i++) {
                asteroids[i].dx = dx_s[i];
                asteroids[i].dy = dy_s[i];
            }
            is_paused = false;
        } else {
            for(let i = 0; i < asteroids.length; i++) {
                dx_s[i] = asteroids[i].dx;
                dy_s[i] = asteroids[i].dy;

                asteroids[i].dx = 0;
                asteroids[i].dy = 0;
            }
            is_paused = true;
        }
    });
    setInterval(GameHandler.loadAsteroids, 1000);
    window.requestAnimationFrame(draw);
}

function draw() {
    ctx.clearRect(0, 0, W, H);

    GameHandler.unloadObjects(asteroids);
    GameHandler.unloadObjects(rockets);
    GameHandler.drawRockets();
    
    ctx.save();
    player.drawPlayer();
    player.update();
    player.reduceSpeed();
    ctx.restore();
    
    // GameHandler.loadAsteroids();
    GameHandler.drawAsteroids();
    GameHandler.collisionAsteroidRocket();
    GameHandler.collisionAsteroidAsteroid();

    window.requestAnimationFrame(draw);
}

window.onload = init;