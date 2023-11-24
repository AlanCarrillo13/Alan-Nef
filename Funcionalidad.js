const playboard = document.querySelector(".game-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const resetButton = document.querySelector("#resetButton"); 
const pauseButton = document.querySelector("#pauseButton");

let juegoPausado = false;
let gameOver = false;
let manzanaX, manzanaY;
let serpienteX = 5, serpienteY = 10;
let serpiente_Cuerpo = [];
let velocidadX = 0, velocidadY = 0;
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

const displayGameOverMessage = () => {
    alert("Has perdido!");
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    displayGameOverMessage();
    
};

const togglePause = () => {
    juegoPausado = !juegoPausado;

    if (juegoPausado) {
        clearInterval(setIntervalId);
    } else {
        setIntervalId = setInterval(initGame, 125);
    }
};

const resetGame = () => {

    juegoPausado = false;
    gameOver = false;
    serpienteX = 5;
    serpienteY = 10;
    serpiente_Cuerpo = [];
    velocidadX = 0;
    velocidadY = 0;
    score = 0;

    changeFoodPosition();
    setIntervalId = setInterval(initGame, 125);

   

    updateScores(); 
};

const updateScores = () => {
    highScore = Math.max(score, highScore);
    localStorage.setItem("high-score", highScore);
    scoreElement.innerHTML = `Score: ${score}`;
    highScoreElement.innerHTML = `High Score: ${highScore}`;
};

const changeFoodPosition = () => {
    manzanaX = Math.floor(Math.random() * 30) + 1;
    manzanaY = Math.floor(Math.random() * 30) + 1;
};

const changeDirection = (event) => {
    if (gameOver) return;

    switch (event.key) {
        case "ArrowUp":
            if (velocidadY !== 1) {
                velocidadX = 0;
                velocidadY = -1;
            }
            break;
        case "ArrowDown":
            if (velocidadY !== -1) {
                velocidadX = 0;
                velocidadY = 1;
            }
            break;
        case "ArrowLeft":
            if (velocidadX !== 1) {
                velocidadX = -1;
                velocidadY = 0;
            }
            break;
        case "ArrowRight":
            if (velocidadX !== -1) {
                velocidadX = 1;
                velocidadY = 0;
            }
            break;
        default:
            break;
    }
};

const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="manzana" style="grid-area: ${manzanaY} / ${manzanaX}"></div>`;

    if (serpienteX === manzanaX && serpienteY === manzanaY) {
        changeFoodPosition();
        serpiente_Cuerpo.push([manzanaX, manzanaY]);
        score++;

        updateScores();
    }

    for (let i = serpiente_Cuerpo.length - 1; i > 0; i--) {
        serpiente_Cuerpo[i] = serpiente_Cuerpo[i - 1];
    }

    serpiente_Cuerpo[0] = [serpienteX, serpienteY];

    serpienteX += velocidadX;
    serpienteY += velocidadY;

    if (serpienteX <= 0 || serpienteX > 30 || serpienteY <= 0 || serpienteY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < serpiente_Cuerpo.length; i++) {
        htmlMarkup += `<div class="cabeza_serpiente" style="grid-area: ${serpiente_Cuerpo[i][1]} / ${serpiente_Cuerpo[i][0]}"></div>`;

        if (i !== 0 && serpiente_Cuerpo[0][1] === serpiente_Cuerpo[i][1] && serpiente_Cuerpo[0][0] === serpiente_Cuerpo[i][0]) {
            gameOver = true;
        }
    }

    playboard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
resetButton.addEventListener("click", resetGame); 
pauseButton.addEventListener("click", togglePause);
