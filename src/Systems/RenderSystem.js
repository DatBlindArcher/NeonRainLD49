const ApeECS = require('ape-ecs');
const { Render } = require('matter-js');

class RenderSystem extends ApeECS.System {
  init() {
    this.query = this.createQuery()
                    .fromAll('Sprite', 'Position', 'Rotation', 'Scale')
                    .persist();
    
    this.singleton = this.world.getEntity('singleton_entity').c;
  }

  update() {
    const render = this.singleton.draw.render;

    if (render) {
      Render.world(render);
    }

    else {
      const ctx = this.singleton.draw.ctx;
      const entities = this.query.execute();
  
      for (const entity of entities) {
          const sprite = entity.getOne('Sprite');
          const pos = entity.getOne('Position');
          const rot = entity.getOne('Rotation').angle;
          const scale = entity.getOne('Scale').scale;
  
          let flip = { x: pos.x, y: this.singleton.game.height - pos.y };
  
          ctx.fillStyle = sprite.color;
          ctx.translate(flip.x, flip.y);
          ctx.rotate(rot * Math.PI / 180);
          ctx.fillRect(-50 * scale, -50 * scale, 100 * scale, 100 * scale);
          ctx.resetTransform();
      }
    }
  }
}

module.exports = RenderSystem;