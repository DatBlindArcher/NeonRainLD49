const ApeECS = require('ape-ecs');
const { Body } = require('matter-js');

class BasketMovementSystem extends ApeECS.System {
  init() {
    this.query = this.createQuery()
                    .fromAll('Position', 'Basket', 'Matter')
                    .persist();
    
    this.singleton = this.world.getEntity('singleton_entity').c;
  }

  update() {
    const entity = this.query.execute().values().next().value;

    if (entity) {
      const m = entity.getOne('Matter');

      if (m.object) {
        const pos = entity.getOne('Position');
        const delta = this.singleton.time.deltaTime;
        const targetX = this.singleton.input.x;

        let trans = (targetX - pos.x) * (delta / 50);
        if (trans > 8) trans = 8;
        if (trans < -8) trans = -8;

        Body.setVelocity(m.object, { x: trans, y: 0 });
        Body.translate(m.object, { x: trans, y: 0 });
        
        let targetAngle = (trans / 50) * Math.PI;
        let transAngle = (targetAngle - m.object.angle) * (delta / 100);
        
        Body.rotate(m.object, -m.object.angle);
        Body.rotate(m.object, transAngle);
      }
    }
  }
}

module.exports = BasketMovementSystem;