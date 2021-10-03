const Scene = require('./scene');

class Game {
    constructor(options) {
        this.run = false;
        this.lastTime = 0;
        this.setup(options.canvas);
        this.scene = new Scene(this);
        window.requestAnimationFrame(this.update.bind(this));
        return Promise.resolve();
    }

    setup(canvas) {
        // canvas
        this.canvas = canvas;
        
        // input
        this.mouse = {
            x: 0,
            y: 0,
            buttons: {},
            down: false
        };

        let self = this;

        canvas.addEventListener('mousemove', (e) => {
            self.mouse.x = e.offsetX;
            self.mouse.y = e.offsetY;
        });

        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });

        document.getElementById("start_button").onclick = function () {
            self.run = true;
            self.update(self.lastTime);
            document.getElementById("game_start").style.display = "none";
        };

        document.getElementById("retry_button").onclick = function () {
            self.scene = new Scene(self);
            self.run = true;
            self.update(self.lastTime);
            document.getElementById("game_over").style.display = "none";
        };
    }
  
    update(time) {
        const deltaTime = Math.min(time - this.lastTime, 500);
        this.lastTime = time;

        // Update scene
        if (!this.scene.update(time, deltaTime, this.mouse)) {
            this.run = false;
            document.getElementById("game_over").style.display = "block";
        }

        if (this.run) window.requestAnimationFrame(this.update.bind(this));
    }  
}

module.exports = Game;