const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const gameOver = document.getElementById("gameOver");
const scoreText = document.getElementById("scoreText");

let gameRunning = false;
let animationId;

const bird = {
    x: 80,
    y: 250,
    width: 40,
    height: 30,
    velocity: 0,
    gravity: 0.45,
    jump: -8
};

let score = 0;

const pipes = [];
const pipeWidth = 70;
const gap = 170;
let pipeSpeed = 3;

startBtn.addEventListener("click", () => {
    menu.style.display = "none";
    canvas.style.display = "block";

    gameRunning = true;
    score = 0;

    bird.y = 250;
    bird.velocity = 0;

    pipes.length = 0;

    createPipe();

    update();
});

function jump() {
    if (gameRunning) {
        bird.velocity = bird.jump;
    }
}

document.addEventListener("keydown", e => {
    if (e.code === "Space") jump();
});

canvas.addEventListener("click", jump);

function createPipe() {

    const topHeight = Math.random() * 250 + 50;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gap,
        passed: false
    });

}

setInterval(() => {
    if (gameRunning)
        createPipe();
}, 1800);

function drawBird() {

    ctx.fillStyle = "yellow";

    ctx.beginPath();
    ctx.arc(
        bird.x + bird.width / 2,
        bird.y + bird.height / 2,
        bird.width / 2,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(bird.x + 28, bird.y + 12, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(bird.x + 40, bird.y + 15);
    ctx.lineTo(bird.x + 50, bird.y + 18);
    ctx.lineTo(bird.x + 40, bird.y + 22);
    ctx.closePath();
    ctx.fill();

}

function drawPipes() {

    ctx.fillStyle = "#1db954";

    pipes.forEach(pipe => {

        pipe.x -= pipeSpeed;

        // tubo superior
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);

        // tubo inferior
        ctx.fillRect(
            pipe.x,
            pipe.bottom,
            pipeWidth,
            canvas.height - pipe.bottom
        );

        // sumar puntos
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            pipe.passed = true;
            score++;
        }

        // colisiones
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (
                bird.y < pipe.top ||
                bird.y + bird.height > pipe.bottom
            )
        ) {
            endGame();
        }

    });

    // eliminar tubos viejos
    while (pipes.length && pipes[0].x < -pipeWidth) {
        pipes.shift();
    }

}

function update() {

    if (!gameRunning) return;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }

    if (bird.y + bird.height >= canvas.height) {
        endGame();
        return;
    }

    drawPipes();
    drawBird();

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Puntos: " + score,20,40);

    animationId = requestAnimationFrame(update);

}

function endGame() {

    gameRunning = false;

    cancelAnimationFrame(animationId);

    canvas.style.display = "none";
    gameOver.style.display = "block";

    scoreText.innerText = "Puntaje: " + score;

}
