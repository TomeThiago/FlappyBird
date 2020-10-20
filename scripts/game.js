console.log('[TomeThiago] Flappy Bird');

const sprites = new Image();
sprites.src = './assets/sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const floor = {
  position_initialX: 0,
  position_initialY: 610,
  width: 224,
  height: 114,
  sizeCanvasX: 0,
  sizeCanvasY: canvas.height - 110,

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
  }
};

const background = {
  position_initialX: 390,
  position_initialY: 0,
  width: 275,
  height: 204,
  sizeCanvasX: 0,
  sizeCanvasY: canvas.height - 204,

  draw() {
    context.fillStyle = '#70c5ce';
    context.fillRect(0,0, canvas.width, canvas.height)

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

const flappyBird = {
  position_initialX: 0,
  position_initialY: 0,
  width: 33,
  height: 24,
  sizeCanvasX: 10,
  sizeCanvasY: 50,
  gravity: 0.25,
  speed: 0,

  updateGravity() {
    this.speed = this.speed + this.gravity;
    this.sizeCanvasY = this.sizeCanvasY + this.speed;
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
  }
}

function game() {

  flappyBird.updateGravity();

  background.draw()
  floor.draw();
  flappyBird.draw();

  requestAnimationFrame(game);
}

game();