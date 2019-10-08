;'use strict';

// Canvas
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let width = canvas.width;
let height =canvas.height;

// Cells
let blockSize = 15;  // size of one cell
let widthInBlocks = width / blockSize;
let heightInBlocks = height / blockSize;

// Score and settings
let score = 0;
const directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down",
};

// Init
let snake, apple, gameInterval;


// Classes
class Block {
  // Cell class
  constructor(col, row) {
    this.col = col;
    this.row = row;
    this.x = col * blockSize;
    this.y = row * blockSize;
    this.centerX = col * blockSize + blockSize / 2;
    this.centerY = row * blockSize + blockSize / 2;
  }

  drawSquare(color) {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, blockSize, blockSize);
  }

  drawCircle(color) {
      ctx.fillStyle = color;
      circle(this.centerX, this.centerY, blockSize/2, true);
  }

  equal(otherBlock) {
    // check equality of cell and other cell positions
    return this.col === otherBlock.col && this.row === otherBlock.row;
  }
}


class Snake {
  // Snake class
  constructor() {
    this.segments = [
      new Block(7, 5),
      new Block(6, 5),
      new Block(5, 5),
    ];

    this.direction = "right";
    this.nextDirection = "right";
  }

  draw() {
    for (let i = 0; i < this.segments.length; i++)
      this.segments[i].drawSquare("Blue");
  }

  move() {
    let head = this.segments[0];
    let newHead;
    this.direction = this.nextDirection;

    if (this.direction === "right")
      newHead = new Block(head.col+1, head.row);
    else if (this.direction === "down")
      newHead = new Block(head.col, head.row+1);
    else if (this.direction === "left")
      newHead = new Block(head.col-1, head.row);
    else if (this.direction === "up")
      newHead = new Block(head.col, head.row-1);

    if (this.checkCollision(newHead)) {
      gameOver(gameInterval);
      return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
      score++;
      apple.move();
    } else {
      this.segments.pop();
    }
  }

  checkCollision(head) {
    let leftCollision = head.col === 0;
    let topCollision = head.row === 0;
    let rightCollision = head.col === widthInBlocks - 1;
    let bottomCollision = head.row === heightInBlocks - 1;
    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    let selfCollision = false;

    for (let i = 0; i < this.segments.length; i++)
      if (head.equal(this.segments[i]))
        selfCollision = true;

    return wallCollision || selfCollision;
  }

  setDirection(newDirection) {
    if (this.direction === "up" && newDirection == "down"
      || this.direction === "right" && newDirection === "left"
      || this.direction === "down" && newDirection === "up"
      || this.direction === "left" && newDirection === "right")
      return

    this.nextDirection = newDirection;
  }
}


class Apple{
  constructor() {
    this.position = new Block(10, 10);
  }

  draw() {
    this.position.drawCircle("LimeGreen");
  }

  move() {
    let randomCol = Math.floor(Math.random() * (widthInBlocks-2)) + 1;
    let randomRow = Math.floor(Math.random() * (heightInBlocks-2)) + 1;
    this.position = new Block(randomCol, randomRow);
  }
}


// Functions
// Border
const drawBorder = () => {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
}

// Score
const drawScore = () => {
  ctx.font = "24px Monospace";
  ctx.fillStyle = "Black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score: " + score, blockSize * 2, blockSize * 2);
}

// Game over
const gameOver = (interval) => {
  clearInterval(interval);
  ctx.font = "60px Monospace";
  ctx.fillStyle = "Black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Game Over", width/2, height/2);

  document.getElementById("restart").classList.remove("off");
}

// Draw circle
const circle = (x,y,r,fill) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, false);
  if (fill)
    ctx.fill()
  else
    ctx.stroke()
}


const newGame = () => {
  snake = new Snake();
  apple = new Apple();
  score = 0;
  if (gameInterval)
    clearInterval(gameInterval);

  gameInterval = setInterval(()=>{
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
  }, 100);
  document.getElementById("restart").classList.add("off");
}


// Event listeners
$("body").keydown((evt)=>{
  let newDirection = directions[evt.keyCode];
  if (newDirection !== undefined)
    snake.setDirection(newDirection);
});


// Start new game
newGame();
