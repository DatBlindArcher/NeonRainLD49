const ApeECS = require('ape-ecs');
const { Body } = require('matter-js');

class HandMovementSystem extends ApeECS.System {
  init() {
    this.query = this.createQuery()
                    .fromAll('Position', 'Hand', 'Matter')
                    .persist();

    this.targetQuery = this.createQuery()
                    .fromAll('Position', 'Basket')
                    .persist();
    
    this.singleton = this.world.getEntity('singleton_entity').c;
  }

  update() {
    const entity = this.query.execute().values().next().value;
    const targetEntity = this.targetQuery.execute().values().next().value;

    if (entity) {
      const m = entity.getOne('Matter');

      if (m.object) {
        const pos = entity.getOne('Position');
        const targetPos = targetEntity.getOne('Position');
        const delta = this.singleton.time.deltaTime;
        const targetX = targetPos.x;

        Body.translate(m.object, { x: (targetX - pos.x) * (delta / 100), y: 0});
      }
    }
  }
}

module.exports = HandMovementSystem;