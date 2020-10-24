console.log('[TomeThiago] Flappy Bird');
console.log('To view this code for this game go to: https://github.com/TomeThiago/FlappyBird');

let frames = 0;

const audioHit = new Audio();
audioHit.src = './sounds/effects/hit.wav';

const sprites = new Image();
sprites.src = './assets/sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const global = {};

const menu = {
  position_initialX: 134,
  position_initialY: 0,
  width: 174,
  height: 152,
  sizeCanvasX: (canvas.width / 2) - 174 / 2,
  sizeCanvasY: 50,

  draw() {
    context.drawImage(
      sprites,
      this.position_initialX,
      this.position_initialY,
      this.width,
      this.height,
      this.sizeCanvasX,
      this.sizeCanvasY,
      this.width,
      this.height,
    );
  }
}

function createFloor() {
  const floor = {
    position_initialX: 0,
    position_initialY: 610,
    width: 224,
    height: 114,
    sizeCanvasX: 0,
    sizeCanvasY: canvas.height - 110,

    update() {
      const frame = 1;
      const repeatIn = this.width / 2;
      const movement = this.sizeCanvasX - frame;

      this.sizeCanvasX = movement % repeatIn;
    },

    draw() {
      context.drawImage(
        sprites,
        this.position_initialX,
        this.position_initialY,
        this.width,
        this.height,
        this.sizeCanvasX,
        this.sizeCanvasY,
        this.width,
        this.height,
      );

      context.drawImage(
        sprites,
        this.position_initialX,
        this.position_initialY,
        this.width,
        this.height,
        (this.sizeCanvasX + this.width),
        this.sizeCanvasY,
        this.width,
        this.height,
      );
    },
  };

  return floor;
}

const sky = {
  position_initialX: 390,
  position_initialY: 0,
  width: 275,
  height: 204,
  sizeCanvasX: 0,
  sizeCanvasY: canvas.height - 204,

  draw() {
    context.fillStyle = '#70c5ce';
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.drawImage(
      sprites,
      this.position_initialX,
      this.position_initialY,
      this.width,
      this.height,
      this.sizeCanvasX,
      this.sizeCanvasY,
      this.width,
      this.height,
    );

    context.drawImage(
      sprites,
      this.position_initialX,
      this.position_initialY,
      this.width,
      this.height,
      (this.sizeCanvasX + this.width),
      this.sizeCanvasY,
      this.width,
      this.height,
    );
  }
}

function createPipe() {
  const pipe = {
    width: 52,
    height: 400,

    floor: {
      sizeCanvasX: 0,
      sizeCanvasY: 169,
    },

    sky: {
      sizeCanvasX: 52,
      sizeCanvasY: 169,
    },
    space: 80,

    draw() {
      this.listPipe.forEach(pipe => {
        const randomY = pipe.y;
        const pipeSpacing = 90;
        //Sky
        const pipeSkyX = pipe.x;
        const pipeSkyY = randomY;

        context.drawImage(
          sprites,
          this.sky.sizeCanvasX,
          this.sky.sizeCanvasY,
          this.width,
          this.height,
          pipeSkyX,
          pipeSkyY,
          this.width,
          this.height
        );

        //Floor
        const pipeFloorX = pipe.x;
        const pipeFloorY = this.height + pipeSpacing + randomY;

        context.drawImage(
          sprites,
          this.floor.sizeCanvasX,
          this.floor.sizeCanvasY,
          this.width,
          this.height,
          pipeFloorX,
          pipeFloorY,
          this.width,
          this.height
        );

        pipe.sky = {
          x: pipeSkyX,
          y: this.height + pipeSkyY
        }

        pipe.floor = {
          x: pipeFloorX,
          y: pipeFloorY
        }
      });
    },

    collision(par) {

      const flappyBirdHead = global.flappyBird.sizeCanvasY;
      const flappyBirdFeet = global.flappyBird.sizeCanvasY + global.flappyBird.height;

      if (global.flappyBird.sizeCanvasX >= par.x) {
        if (flappyBirdHead <= par.sky.y) {
          return true;
        }

        if (flappyBirdFeet >= par.floor.y) {
          return true;
        }
      }

      return false;
    },

    listPipe: [],

    update() {
      const passed100Frames = frames % 100 === 0;

      if (passed100Frames) {
        this.listPipe.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      this.listPipe.forEach(pipe => {
        pipe.x = pipe.x - 2;

        if (this.collision(pipe)) {
          audioHit.play()
          setTimeout(() => audioHit.play(), 500);
          changeScreen(screens.INITIAL);
        }

        if (pipe.x + this.width <= 0) {
          this.listPipe.shift();
        }
      })
    }
  }

  return pipe;
}

function drawBackground() {
  sky.draw();
  global.floor.draw();
}

function collision(flappyBird, floor) {

  const flappyBirdY = flappyBird.sizeCanvasY + flappyBird.height;
  const floorY = floor.sizeCanvasY;

  return (flappyBirdY >= floorY);
}

function createFlappyBird() {

  const flappyBird = {
    position_initialX: 0,
    position_initialY: 0,
    width: 33,
    height: 24,
    sizeCanvasX: 10,
    sizeCanvasY: 50,
    gravityForce: 0.25,
    speed: 0,
    jumpSize: 4.6,

    jump() {
      this.speed = -this.jumpSize;
    },

    update() {

      if (collision(this, global.floor)) {

        audioHit.play()
        setTimeout(() => audioHit.play(), 500);

        changeScreen(screens.INITIAL);
        return;
      }

      this.speed = this.speed + this.gravityForce;
      this.sizeCanvasY = this.sizeCanvasY + this.speed;
    },

    movement: [
      { position_initialX: 0, position_initialY: 0 },
      { position_initialX: 0, position_initialY: 26 },
      { position_initialX: 0, position_initialY: 52 },
      { position_initialX: 0, position_initialY: 26 }
    ],

    frameAtual: 0,

    updateFrameAtual() {

      const intervalFrame = 10;
      const passedInterval = frames % intervalFrame === 0;

      if (passedInterval) {
        const baseIncrement = 1;
        const increment = ++this.frameAtual;
        this.frameAtual = increment % this.movement.length;
      }
    },

    draw() {
      this.updateFrameAtual();

      const { position_initialX, position_initialY } = this.movement[this.frameAtual];

      context.drawImage(
        sprites,
        position_initialX,
        position_initialY,
        this.width,
        this.height,
        this.sizeCanvasX,
        this.sizeCanvasY,
        this.width,
        this.height,
      );
    }
  }

  return flappyBird;
}

let screenActive = {};

function changeScreen(screen) {
  screenActive = screen;


  if (screenActive.inicialize) {
    screenActive.inicialize();
  }

}

//screens
const screens = {
  INITIAL: {
    inicialize() {
      global.flappyBird = createFlappyBird();
      global.floor = createFloor();
      global.pipe = createPipe();
    },

    draw() {
      drawBackground();
      menu.draw();
      global.flappyBird.draw();
    },

    click() {
      changeScreen(screens.GAME);
    },

    update() {
      global.floor.update();
    }
  },

  GAME: {
    draw() {
      drawBackground();
      global.pipe.draw();
      global.flappyBird.draw();
    },

    click() {
      global.flappyBird.jump();
    },

    update() {
      global.floor.update();
      global.pipe.update();
      global.flappyBird.update();
    }
  }
}

function game() {

  screenActive.draw();
  screenActive.update();

  frames++;

  requestAnimationFrame(game);
}

window.addEventListener('click', function () {
  if (screenActive.click) {
    screenActive.click();
  }
});

changeScreen(screens.INITIAL);
game();