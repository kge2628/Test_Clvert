const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const gravity = 0.5;
const flapStrength = -8;
const pipeWidth = 50;
const pipeGap = 150;
const pipeSpeed = 3;
const pipeSpawnRate = 120; // Frames between pipe spawns

let frameCount = 0;
let score = 0;
let gameOver = false;

class Player {
  constructor() {
    this.position = { x: 150, y: 200 };
    this.velocity = { x: 0, y: 0 };
    this.width = 40;
    this.height = 30;
    this.image = new Image();
    this.image.src = 'jumping_character.jpg';
  }

  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
    this.draw();

    if (this.position.y < 0) {
        this.position.y = 0;
        this.velocity.y = 0;
    }
  }

  flap() {
      if (!gameOver) {
        this.velocity.y = flapStrength;
      }
  }
}

class Pipe {
  constructor() {
    this.position = { x: canvas.width };
    this.width = pipeWidth;
    this.topPipeHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
    this.passed = false; // Add passed property
  }

  draw() {
    ctx.fillStyle = "green";
    // Top pipe
    ctx.fillRect(this.position.x, 0, this.width, this.topPipeHeight);
    // Bottom pipe
    const bottomPipeY = this.topPipeHeight + pipeGap;
    ctx.fillRect(
      this.position.x,
      bottomPipeY,
      this.width,
      canvas.height - bottomPipeY
    );
  }

  update() {
    this.position.x -= pipeSpeed;
    this.draw();
  }
}

let player = new Player();
let pipes = [];

function resetGame() {
    player = new Player();
    pipes = [];
    score = 0;
    frameCount = 0;
    gameOver = false;
    animate();
}

function checkCollisions() {
    // Ground collision
    if (player.position.y + player.height >= canvas.height) {
        gameOver = true;
    }

    // Pipe collision
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        const bottomPipeY = pipe.topPipeHeight + pipeGap;

        if (
            player.position.x < pipe.position.x + pipe.width &&
            player.position.x + player.width > pipe.position.x &&
            (player.position.y < pipe.topPipeHeight || player.position.y + player.height > bottomPipeY)
        ) {
            gameOver = true;
        }
    }
}

function animate() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Click to Restart", canvas.width / 2, canvas.height / 2 + 40);
    return;
  }

  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Spawn pipes
  frameCount++;
  if (frameCount % pipeSpawnRate === 0) {
    pipes.push(new Pipe());
  }

  // Update and draw pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();

    // Score increment
    if (!pipes[i].passed && pipes[i].position.x + pipes[i].width < player.position.x) {
        pipes[i].passed = true;
        score++;
    }

    // Remove pipes that are off-screen
    if (pipes[i].position.x + pipes[i].width < 0) {
      pipes.splice(i, 1);
    }
  }

  player.update();
  checkCollisions();

  // Draw Score
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

// Event Listeners
document.addEventListener("keydown", (event) => {
  if (event.code === 'Space') {
    player.flap();
  }
});

document.addEventListener("mousedown", () => {
  if (gameOver) {
    resetGame();
  } else {
      player.flap();
  }
});

animate();
