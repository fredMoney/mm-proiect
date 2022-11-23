const my_canvas = document.getElementById('canvas_joc');
const ctx = my_canvas.getContext('2d');
const W = my_canvas.clientWidth;
const H = my_canvas.clientHeight;
const colors = ['#fff', '#0f0', '#00f', '#f00'];
const rockets = [];
const asteroids = [];
var player;

class Asteroid {
    // asteroizii se spawneaza in stanga sau in dreapta
    // canvasului.
    constructor() {
        this.health = Math.round(1 + Math.random() * 3);
        // TODO: ajusteaza viteza ca sa fie playable
        this.dx = 0.5 + Math.random() * 3;
        this.dy = 0.5 + Math.random() * 3;
        // se determina in care parte se spawneaza asteroidul
        if(Math.random() < 0.5) {
            // stanga
            this.x = -37;   // 37 -> raza maxima a asteroidului
            
        } else {
            // dreapta
            this.x = W + 37;
            this.dx *= -1;
        }
        if(Math.random() < 0.5) {
            // sus
            this.y = -37;   // 37 -> raza maxima a asteroidului
            
        } else {
            // jos
            this.y = H + 37;
            this.dy *= -1;
        }
        this.r = 25 + this.health * 3;
    }

    drawAsteroid() {
        ctx.beginPath();
        ctx.fillStyle = colors[this.health - 1];

        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
// 
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 30px arial';
        ctx.fillText(`${this.health}`, this.x - 10, this.y + 10);
        ctx.closePath();
    }

    updateAsteroid() {
        this.x += this.dx;
        this.y += this.dy;
    }

    hit() {
        this.health--;
    }
}

class Player {
    constructor() {
        this.x = W/2;
        this.y = H/2;
        this.rotation = 0;
        this.size = 15;
        this.max_speed = 24;
        this.acc = this.max_speed/6;
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
        console.log('shot');
        rockets.push(new Rocket(this.x, this.y, this.rotation - Math.PI/2));
    }

    reduceSpeed() {
        if(this.speed_x > 0) {
            this.speed_x -= this.acc/4;
        }
        if(this.speed_x < 0) {
            this.speed_x += this.acc/4;
        }
        if(this.speed_y > 0) {
            this.speed_y -= this.acc/4;
        }
        if(this.speed_y < 0) {
            this.speed_y += this.acc/4;
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
        console.log(`x:${this.x}, y:${this.y}, sx:${this.speed_x}, sy${this.speed_y}`);
    }
}

class Rocket {
    constructor(x, y, rotation) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.r = 5;
        this.speed = 10;
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
        if(asteroids.length < 10) {
            asteroids.push(new Asteroid());
        }
    }

    static drawAsteroids() {
        asteroids.forEach(asteroid => {
            asteroid.drawAsteroid();
            asteroid.updateAsteroid();
        });
    }

    static drawRockets() {
        rockets.forEach(rocket => {
            rocket.draw();
            rocket.update();
            // rocket.coords();
        })
    }

    static isOutOfBounds(x, y) {
        if(x < -50 || x > W + 50 ||
            y < -50 || y > H + 50) {        // daca asteroidul iese cu 50 din canvas va fi sters
            return true;
        }
        return false;
    }

    static unloadAsteroids(index = -1) {
        //var index = -1;
        asteroids.forEach(asteroid => {
            if(GameHandler.isOutOfBounds(asteroid.x, asteroid.y) || asteroid.health === 0) {
                index = asteroids.indexOf(asteroid);
            }
        });
        if(index > -1) {
            asteroids.splice(index, 1);
        }
    }

    static unloadRockets(index = -1) {
        //var index = -1;
        rockets.forEach(rocket => {
            if(GameHandler.isOutOfBounds(rocket.x, rocket.y)) {
                index = rockets.indexOf(rocket);
            }
        });
        if(index > -1) {
            rockets.splice(index, 1);
        }
    }

    static checkCollision() {
        asteroids.forEach(asteroid => {
            rockets.forEach(rocket => {
                //TODO: verifica daca merge
                if((rocket.x >= asteroid.x - asteroid.r || rocket.x <= asteroid.x + asteroid.r) &&
                  (rocket.y >= asteroid.y - asteroid.r || rocket.y <= asteroid.y + asteroid.r)) {
                    asteroid.hit();
                    GameHandler.unloadRockets(rockets.indexOf(rocket));
                }
            });
        });
    }
}

function init() {
    player = new Player();
    window.addEventListener("keydown", (e) => {
        switch (e.keyCode) {
            // DEPLASARE
            case 37:
                // left"
                // player.x -= player.speed;
                player.moveX((-1)*player.acc);
                break;
            case 38:
                // up"
                // player.y -= player.speed;
                player.moveY((-1)*player.acc);
                break;
            case 39:
                // right"
                // player.x += player.speed;
                player.moveX(player.acc);
                break;
            case 40:
                // down"
                // player.y += player.speed;
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
                player.shoot();
                break;
        }
    });
    window.requestAnimationFrame(draw);
}

function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    player.drawPlayer();
    player.update();
    player.reduceSpeed();
    // player.coords();
    ctx.restore();
    GameHandler.drawRockets();
    GameHandler.loadAsteroids();
    GameHandler.drawAsteroids();
    GameHandler.unloadAsteroids();
    GameHandler.unloadRockets();

    window.requestAnimationFrame(draw);
}

window.onload = init;
