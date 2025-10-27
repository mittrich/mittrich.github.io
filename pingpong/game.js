const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 30;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);

function drawRect(x, y, w, h, color = "#fff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color = "#fff") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = "#fff4";
    ctx.lineWidth = 4;
    for (let y = 0; y < canvas.height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, y);
        ctx.lineTo(canvas.width / 2, y + 16);
        ctx.stroke();
    }
}

function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

function updateAI() {
    // Simple AI: move center of AI paddle toward ball
    let paddleCenter = aiY + PADDLE_HEIGHT / 2;
    if (paddleCenter < ballY + BALL_SIZE / 2 - 8) {
        aiY += PADDLE_SPEED * 0.85;
    } else if (paddleCenter > ballY + BALL_SIZE / 2 + 8) {
        aiY -= PADDLE_SPEED * 0.85;
    }
    // Clamp to canvas
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function update() {
    // Move ball
    ballX += ballVelX;
    ballY += ballVelY;

    // Ball collision with top/bottom
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballVelY = -ballVelY;
        ballY = Math.max(0, Math.min(canvas.height - BALL_SIZE, ballY));
    }

    // Ball collision with player paddle
    if (
        ballX < PLAYER_X + PADDLE_WIDTH &&
        ballX > PLAYER_X &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballVelX = Math.abs(ballVelX);
        // Add some "spin" based on where it hit the paddle
        let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballVelY = collidePoint * 0.25;
    }

    // Ball collision with AI paddle
    if (
        ballX + BALL_SIZE > AI_X &&
        ballX + BALL_SIZE < AI_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballVelX = -Math.abs(ballVelX);
        let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballVelY = collidePoint * 0.25;
    }

    // Ball out of bounds (score)
    if (ballX < 0 || ballX + BALL_SIZE > canvas.width) {
        resetBall();
    }

    updateAI();
}

function render() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // Draw net
    drawNet();

    // Draw paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");

    // Draw ball
    drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, "#fff");
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Mouse control for player's paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Start game
gameLoop();