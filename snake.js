// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get the score element
const scoreElement = document.getElementById('score');

// Define the size of each grid cell and the canvas
const gridSize = 20;
const canvasSize = 400;

// Initialize the snake with one segment
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];

// Initialize the direction of the snake (initially not moving)
let direction = { x: 0, y: 0 };

// Initialize the position of the food
let food = { x: gridSize * 10, y: gridSize * 10 };

// Initialize the obstacles
let obstacles = [
    { x: gridSize * 7, y: gridSize * 7 },
    { x: gridSize * 12, y: gridSize * 12 },
    { x: gridSize * 15, y: gridSize * 5 }
];

// Initialize the score
let score = 0;

// Function to draw a rectangle (used for snake, food, and obstacles)
function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

// Function to draw the snake
function drawSnake() {
    snake.forEach(segment => drawRect(segment.x, segment.y, 'lime'));
}

// Function to draw the food
function drawFood() {
    drawRect(food.x, food.y, 'red');
}

// Function to draw the obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => drawRect(obstacle.x, obstacle.y, 'gray'));
}

// Function to update the snake's position
function updateSnake() {
    // Create a new head based on the current direction
    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wrap the snake's position when it goes beyond the canvas boundaries
    if (head.x < 0) head.x = canvasSize - gridSize;
    if (head.x >= canvasSize) head.x = 0;
    if (head.y < 0) head.y = canvasSize - gridSize;
    if (head.y >= canvasSize) head.y = 0;

    snake.unshift(head);

    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore(); // Update the score display
        placeFood(); // Place new food
    } else {
        snake.pop(); // Remove the last segment if no food is eaten
    }

    // Check for collisions with itself or obstacles
    if (snakeCollision(head) || obstacleCollision(head)) {
        resetGame(); // Reset the game if a collision occurs
    }
}

// Function to check if the snake collides with itself
function snakeCollision(head) {
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

// Function to check if the snake collides with an obstacle
function obstacleCollision(head) {
    return obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y);
}

// Function to place the food at a random position
function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    };
}

// Function to reset the game
function resetGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = { x: 0, y: 0 };
    score = 0;
    updateScore(); // Reset the score display
    placeFood();
}

// Function to update the score display
function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas
    drawSnake(); // Draw the snake
    drawFood(); // Draw the food
    drawObstacles(); // Draw the obstacles
    updateSnake(); // Update the snake's position
    setTimeout(gameLoop, 100); // Repeat the loop every 100ms
}

// Event listener for keyboard input to control the snake
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});

// Start the game loop
gameLoop();