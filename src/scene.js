const ApeECS = require('ape-ecs');
const { Engine, Render, Bodies, Common } = require('matter-js');
const Components = require('./components');
const Systems = require('./systems');

class Scene {
    constructor(game) {
        this.ecs = new ApeECS.World();
        Common.setDecomp(require('poly-decomp'));

        this.engine = Engine.create({ 
            gravity: { x: 0, y: 0 } 
        });

        this.render = Render.create({ 
            canvas: document.getElementById('game'), 
            engine: this.engine, 
            options: { 
                wireframes: false,
                background: '#020008'
            }
        });

        // Component Register

        this.ecs.registerComponent(Components.Game, 1);
        this.ecs.registerComponent(Components.Time, 1);
        this.ecs.registerComponent(Components.Input, 1);
        this.ecs.registerComponent(Components.Physics, 1);
        this.ecs.registerComponent(Components.Draw, 1);
        this.ecs.registerComponent(Components.Spawner, 1);
        this.ecs.registerComponent(Components.Audio, 1);

        this.ecs.registerComponent(Components.Basket, 1);
        this.ecs.registerComponent(Components.Hand, 1);
        
        this.ecs.registerComponent(Components.Position, 32);
        this.ecs.registerComponent(Components.Rotation, 32);
        this.ecs.registerComponent(Components.Scale, 32);
        this.ecs.registerComponent(Components.Sprite, 32);
        this.ecs.registerComponent(Components.Fruit, 32);
        this.ecs.registerComponent(Components.Matter, 32);

        // Create Singleton

        const singleton_entity = this.ecs.createEntity({
            id: 'singleton_entity',
            components: [{
                type: 'Game',
                key: 'game',
                width: game.canvas.width,
                height: game.canvas.height
            }, {
                type: 'Time',
                key: 'time'
            }, {
                type: 'Input',
                key: 'input'
            }, {
                type: 'Physics',
                key: 'physics',
                engine: this.engine,
                gravity: 0.02
            }, {
                type: 'Draw',
                key: 'draw',
                canvas: game.canvas,
                ctx: game.canvas.getContext("2d"),
                render: this.render
            }, {
                type: 'Audio',
                key: 'audio',
                samples: new Map([
                    ['hit', new Audio('/audio/hit.wav')],
                    ['bounce', new Audio('/audio/bounce.wav')],
                    ['points', new Audio('/audio/points.wav')],
                    ['spawn', new Audio('/audio/spawn.wav')]
                ])
            }, {
                type: 'Spawner',
                key: 'spawner'
            }]
        });

        this.singleton = singleton_entity.c;

        // System Register

        this.ecs.registerSystem('logic', Systems.Life);
        this.ecs.registerSystem('logic', Systems.FruitSpawner);
        this.ecs.registerSystem('logic', Systems.HandMovement);
        this.ecs.registerSystem('logic', Systems.BasketMovement);
        this.ecs.registerSystem('logic', Systems.FruitMovement);
        this.ecs.registerSystem('physics', Systems.Physics);
        this.ecs.registerSystem('physics', Systems.FruitScore);
        this.ecs.registerSystem('render', Systems.Render);

        // Create Entities

        /*this.ecs.createEntity({
            id: 'hand_entity',
            components: [{
                type: 'Sprite',
                setOptions: function(render) {
                    render.fillStyle = 'transparent';
                    render.strokeStyle = 'cyan';
                    render.lineWidth = 1;
                }
            }, {
                type: 'Position',
                x: game.canvas.width / 2, 
                y: game.canvas.height
            }, {
                type: 'Rotation',
                angle: 0
            }, {
                type: 'Scale',
                x: 1, y: 1
            }, { type: 'Hand' }, { 
                type: 'Matter', 
                static: true, 
                objectCreate: function(pos) { 
                    return Bodies.circle(pos.x, pos.y, 45); 
                } 
            }]
        });*/

        this.ecs.createEntity({
            id: 'basket_entity',
            components: [{
                type: 'Sprite',
                setOptions: function(render) {
                    render.fillStyle = 'transparent';
                    render.strokeStyle = '#80FF00';
                    render.lineWidth = 1;
                }
            }, {
                type: 'Position',
                x: game.canvas.width / 2, 
                y: game.canvas.height - 65
            }, {
                type: 'Rotation',
                angle: 0
            }, {
                type: 'Scale',
                x: 1, y : 1
            }, { type: 'Basket' }, { 
                type: 'Matter', 
                static: true,
                objectCreate: this.createBasket
            }]
        });

        this.singleton_entity = null;
        this.scores = document.getElementsByClassName("score_value");
        this.hearts = [];

        for (let i = 0; i < 4; i++) 
            this.hearts.push(document.getElementById("heart_" + i));
    }

    createBasket(pos) {
        const edge = 20;
        const top = 160;
        const bottom = 120;
        const height = 60;
        const norm = edge / Math.sqrt(2 * (edge * edge)) * edge;

        return Bodies.fromVertices(pos.x, pos.y, [
            { x: -top, y: 0 },
            { x: -bottom, y: height },
            { x: bottom, y: height },
            { x: top, y: 0 },
            { x: top - edge, y: 0 },
            { x: bottom - norm, y: height - norm },
            { x: -bottom + norm, y: height - norm },
            { x: -top + edge, y: 0 }
        ]); 
    }

    update(time, deltaTime, input) {
        this.singleton.time.deltaTime = deltaTime;
        this.singleton.input.x = input.x;
        this.singleton.input.y = input.y;

        let ctx = this.singleton.draw.ctx; 
        ctx.shadowBlur = 8;
        ctx.shadowColor = "white";

        this.ecs.tick();
        this.ecs.runSystems('logic');
        this.ecs.runSystems('physics');
        this.ecs.runSystems('render');

        ctx.strokeStyle = '#80FF00D0';
        ctx.lineWidth = 1;

        this.drawSine(ctx, this.singleton.game.width, this.singleton.game.height, 12, 1.5, 10, time, -0.03);
        this.drawSine(ctx, this.singleton.game.width, this.singleton.game.height, 12, 1, 5, time, -0.03);
        this.drawSine(ctx, this.singleton.game.width, this.singleton.game.height, 12, 1.25, 7.5, time, -0.03);

        ctx.strokeStyle = '#80809E60';
        this.drawSine(ctx, this.singleton.game.width, this.singleton.game.height, 160, 0.1, 16, time, -0.005);
        ctx.strokeStyle = '#4284FF40';
        this.drawSine(ctx, this.singleton.game.width, this.singleton.game.height, 320, 0.05, 16, time, -0.002);
        ctx.strokeStyle = '#C249FF20';
        this.drawSine(ctx, this.singleton.game.width, this.singleton.game.height, 480, 0.02, 16, time, -0.002);

        for (let score of this.scores) {
            score.textContent = this.singleton.game.score;
        }

        for (let i = 0; i < 4; i++) {
            this.hearts[i].style.display = i + 1 > this.singleton.game.lifes ? 'none' : 'block';
        }

        return this.singleton.game.lifes > 0;
    }

    drawSine(ctx, width, height, alt, interval, amplitude, time, speed) {
        var counter = 0, x = 0, y = height - alt;
        var increase = interval * (90 / 180 * Math.PI / 9);
        ctx.beginPath();

        for (let i = 0; i <= width; i += 2) {
            ctx.moveTo(x,y);
            x = i;
            y = height - alt - Math.sin(time * speed + counter) * amplitude;
            counter += increase;
            ctx.lineTo(x,y);
        }

        ctx.stroke();
    }
}

module.exports = Scene;