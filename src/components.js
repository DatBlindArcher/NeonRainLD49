const ApeECS = require('ape-ecs');
const Component = ApeECS.Component;

class Game extends Component {
    static properties = {
        width: 0,
        height: 0,
        score: 0,
        lifes: 4
    }
}

class Time extends Component {
    static properties = {
        deltaTime: 0
    }
}

class Input extends Component {
    static properties = {
        x: 0,
        dy: 0
    }
}

class Physics extends Component {
    static properties = {
        engine: undefined,
        gravity: -0.5,
        difficulty: 1
    }
}

class Draw extends Component {
    static properties = {
        canvas: undefined,
        ctx: undefined,
        render: undefined
    }
}

class Audio extends Component {
    static properties = {
        samples: undefined
    }
}

class Spawner extends Component {
    static properties = {
        timer: 2000,
        time: 1000,
        enabled: true
    }
}

class Position extends Component {
    static properties = {
        x: 0,
        y: 0
    }
}

class Rotation extends Component {
    static properties = {
        angle: 0
    }
}

class Scale extends Component {
    static properties = {
        x: 1,
        y: 1
    }
}

class Matter extends Component {
    static properties = {
        object: undefined,
        objectCreate: undefined,
        static: false
    }
}

class Sprite extends Component {
    static properties = {
        sprite: null,
        setOptions: undefined
    }
}

class Fruit extends Component {
    static properties = {
        fruit_type: 'APPLE'
    }
}

class Basket extends Component {}

module.exports = {
    Game,
    Time,
    Input,
    Physics,
    Draw,
    Audio,
    Spawner,
    Basket,

    Position,
    Rotation,
    Scale,
    Sprite,
    Matter,
    Fruit
};