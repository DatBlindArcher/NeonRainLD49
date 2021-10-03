const FruitSpawner = require('./Systems/FruitSpawnerSystem');
const HandMovement = require('./Systems/HandMovementSystem');
const BasketMovement = require('./Systems/BasketMovementSystem');
const FruitMovement = require('./Systems/FruitMovementSystem');
const Physics = require('./Systems/PhysicsSystem');
const FruitScore = require('./Systems/FruitScoreSystem');
const Life = require('./Systems/LifeSystem');
const Render = require('./Systems/RenderSystem');

module.exports = {
    FruitSpawner,
    HandMovement,
    BasketMovement,
    FruitMovement,
    Physics,
    FruitScore,
    Life,
    Render
};