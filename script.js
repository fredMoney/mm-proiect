const my_canvas = document.getElementById('canvas_joc');
const ctx = my_canvas.getContext('2d');
const W = my_canvas.clientWidth;
const H = my_canvas.clientHeight;
const colors = ['#fff', '#0f0', '#00f', '#f00'];
const rockets = [];
const asteroids = [];

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
            this.x = -37;   // 28 -> raza maxima a asteroidului
            
        } else {
            // dreapta
            this.x = W + 37;
            this.dx *= -1;
        }
        if(Math.random() < 0.5) {
            // sus
            this.y = -37;   // 28 -> raza maxima a asteroidului
            
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

    isOutOfBounds() {
        if(this.x < -50 || this.x > W + 50 ||
            this.y < -50 || this.y > H + 50) {        // daca asteroidul iese cu 50 din canvas va fi sters
            return true;
        }
        return false;
    }

    isHit() {
        rockets.forEach(rocket => {

        });
    }
}

class Player {
    constructor() {
        // TODO: invata transform

    }
}

function loadAsteroids() {
    if(asteroids.length < 10) {
        asteroids.push(new Asteroid());
    }
}

function drawAsteroids() {
    asteroids.forEach(asteroid => {
        asteroid.drawAsteroid();
        asteroid.updateAsteroid();
    });
}

function unloadAsteroids() {
    var index = -1;
    asteroids.forEach(asteroid => {
        if(asteroid.isOutOfBounds()) {
            index = asteroids.indexOf(asteroid);
        }
    });
    if(index > -1) {
        asteroids.splice(index, 1);
    }
}

function init() {
    window.requestAnimationFrame(draw);
}

function draw() {
    ctx.clearRect(0, 0, W, H);

    loadAsteroids();
    drawAsteroids();
    unloadAsteroids();

    window.requestAnimationFrame(draw);
}

window.onload = init;