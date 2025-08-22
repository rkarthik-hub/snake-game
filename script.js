// Canvas & Context
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");

// Grid settings
const GRID_SIZE = 20;
const GRID_WIDTH = canvas.width / GRID_SIZE;
const GRID_HEIGHT = canvas.height / GRID_SIZE;

// Game state
let snake, dx, dy, food, score, gameRunning;

// Initialize game
function initGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = "0";
  generateFood();
  gameRunning = true;
  gameOverScreen.classList.add("hidden");
  gameLoop();
}

// Generate food at random position
function generateFood() {
  food = {
    x: Math.floor(Math.random() * GRID_WIDTH),
    y: Math.floor(Math.random() * GRID_HEIGHT)
  };

  // Prevent food from spawning on snake
  for (const segment of snake) {
    if (segment.x === food.x && segment.y === food.y) {
      return generateFood();
    }
  }
}

// Game loop
function gameLoop() {
  if (!gameRunning) return;

  setTimeout(() => {
    clearCanvas();
    moveSnake();
    drawFood();
    drawSnake();
    requestAnimationFrame(gameLoop);
  }, 150); // Game speed (higher = slower)
}

// Clear canvas
function clearCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw snake
function drawSnake() {
  ctx.fillStyle = "#48bb78"; // Soft green
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

    // Add slight border to separate segments
    ctx.strokeStyle = "black";
    ctx.strokeRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  });
}

// Draw food
function drawFood() {
  ctx.fillStyle = "#e53e3e"; // Red
  ctx.beginPath();
  ctx.arc(
    food.x * GRID_SIZE + GRID_SIZE / 2,
    food.y * GRID_SIZE + GRID_SIZE / 2,
    GRID_SIZE / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// Move snake
function moveSnake() {
  if (dx === 0 && dy === 0) return;

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wall collision
  if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
    return endGame();
  }

  // Self collision
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return endGame();
    }
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

// End game
function endGame() {
  gameRunning = false;
  gameOverScreen.classList.remove("hidden");
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Prevent reversing into self
  if (key === "ArrowUp" && dy !== 1) {
    dx = 0;
    dy = -1;
  } else if (key === "ArrowDown" && dy !== -1) {
    dx = 0;
    dy = 1;
  } else if (key === "ArrowLeft" && dx !== 1) {
    dx = -1;
    dy = 0;
  } else if (key === "ArrowRight" && dx !== -1) {
    dx = 1;
    dy = 0;
  }
});

// Restart button
restartBtn.addEventListener("click", initGame);

// Start the game on load
initGame();