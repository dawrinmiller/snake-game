// Constants
const CANVAS_BORDER_COLOR = 'black';
const CANVAS_BACKGROUND_COLOR = 'blue';
const SNAKE_COLOR = 'lightgreen';
const SNAKE_BORDER_COLOR = 'darkgreen';
const FOOD_COLOR = 'red';
const FOOD_BORDER_COLOR = 'darkred';

let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150},
];

let score = 0;
let dx = 10;
let dy = 0;
let gameInterval;
let changingDirection = false;

const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext("2d");
const startButton = document.getElementById('startButton');
const backgroundMusic = document.getElementById('backgroundMusic');

startButton.addEventListener('click', function() {
    if (gameInterval) clearInterval(gameInterval);
    resetGame();
    gameInterval = setInterval(main, 100);
    backgroundMusic.play();
});

document.addEventListener("keydown", changeDirection);

function main() {
    if (didGameEnd()) {
        clearInterval(gameInterval);
        return;
    }
    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
}

function resetGame() {
    snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150},
    ];
    score = 0;
    dx = 10;
    dy = 0;
    document.getElementById('score').innerHTML = score;
    clearCanvas();
    createFood();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
    ctx.strokeStyle = CANVAS_BORDER_COLOR;
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const didCollide = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (didCollide) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function drawFood() {
    ctx.fillStyle = FOOD_COLOR;
    ctx.strokeStyle = FOOD_BORDER_COLOR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        document.getElementById('score').innerHTML = score;
        createFood();
    } else {
        snake.pop();
    }
}

function randomTen(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, gameCanvas.width - 10);
    foodY = randomTen(0, gameCanvas.height - 10);
    snake.forEach(function isOnSnake(part) {
        if (part.x == foodX && part.y == foodY) createFood();
    });
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = SNAKE_COLOR;
    ctx.strokeStyle = SNAKE_BORDER_COLOR;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const KEY_PRESSED = event.keyCode;

    const GOING_UP = dy === -10;
    const GOING_DOWN = dy === 10;
    const GOING_RIGHT = dx === 10;
    const GOING_LEFT = dx === -10;

    if (KEY_PRESSED === LEFT_KEY && !GOING_RIGHT) {
        dx = -10;
        dy = 0;
    }

    if (KEY_PRESSED === UP_KEY && !GOING_DOWN) {
        dx = 0;
        dy = -10;
    }

    if (KEY_PRESSED === RIGHT_KEY && !GOING_LEFT) {
        dx = 10;
        dy = 0;
    }

    if (KEY_PRESSED === DOWN_KEY && !GOING_UP) {
        dx = 0;
        dy = 10;
    }
}


