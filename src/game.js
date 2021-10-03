const Scene = require('./scene');

class Game {
    constructor(options) {
        this.run = false;
        this.lastTime = 0;
        this.difficulty = 1;
        this.sfx = document.getElementById("sfx_slider").value / 100;
        this.setup(options.canvas);
        this.scene = new Scene(this);
        this.music = new Audio('/audio/music.wav');
        this.music.loop = true;
        this.music.volume = document.getElementById("bg_slider").value / 100;
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
            self.music.currentTime = 0;
            self.music.play();
            self.run = true;
            self.update(self.lastTime);
            document.getElementById("game_start").style.display = "none";

        };

        document.getElementById("retry_button").onclick = function () {
            self.music.currentTime = 0;
            self.music.play();
            self.scene = new Scene(self);
            self.run = true;
            self.update(self.lastTime);
            document.getElementById("game_over").style.display = "none";
        };

        document.getElementById("easy").onclick = function () {
            self.difficulty = 0;
        };

        document.getElementById("medium").onclick = function () {
            self.difficulty = 1;
        };

        document.getElementById("hard").onclick = function () {
            self.difficulty = 2;
        };

        let sfx_slider = document.getElementById("sfx_slider");
        let bg_slider = document.getElementById("bg_slider");

        sfx_slider.onchange = function () {
            self.sfx = sfx_slider.value / 100;
        };

        bg_slider.onchange = function () {
            self.music.volume = bg_slider.value / 100;
        };
    }
  
    update(time) {
        const deltaTime = Math.min(time - this.lastTime, 500);
        this.lastTime = time;

        // Update scene
        if (!this.scene.update(time, deltaTime, this.mouse, this.sfx)) {
            this.run = false;
            this.music.pause();
            document.getElementById("game_over").style.display = "block";
        }

        if (this.run) window.requestAnimationFrame(this.update.bind(this));
    }  
}

module.exports = Game;