// script.js
const audioFiles = [
  "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3",
];

const simonBoard = document.querySelector(".simon-board");
const startButton = document.getElementById("start-button");
startButton.addEventListener("click", startOver);
const strictModeCheckbox = document.getElementById("strict-mode");
const stepDisplay = document.getElementById("step");

let gamePattern = [];
let userPattern = [];
let level = 0;
let strictMode = false;
let gamePlaying = false;

function playSound(color) {
  const audio = new Audio(audioFiles[color - 1]);
  audio.play();
}

function animateButton(color) {
  const button = document.querySelector(`[data-color="${color}"]`);
  button.classList.add("pressed");
  setTimeout(() => {
    button.classList.remove("pressed");
  }, 300); // Retrasar la eliminación en 300 milisegundos
}

async function nextSequence() {
    userPattern = [];
    level++;
    stepDisplay.textContent = level;
    const randomColor = Math.floor(Math.random() * 4) + 1;
    gamePattern.push(randomColor);
  
    for (let i = 0; i < gamePattern.length; i++) {
      const color = gamePattern[i];

      
      // Espera un momento antes de reproducir el sonido
      await new Promise((resolve) => {
          setTimeout(() => {
            animateButton(color);
            // Reproduce el sonido
            playSound(color);
          resolve();
        }, 500);
      });
  
  
      // Espera un momento antes de quitar el resaltado
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
  
  
      // Espera un momento antes de continuar con el siguiente color
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    }
  
    gamePlaying = true;
  }
function checkAnswer() {
  if (userPattern.length === gamePattern.length) {
    if (JSON.stringify(userPattern) === JSON.stringify(gamePattern)) {
      if (level === 20) {
        setTimeout(() => {
          alert("Congratulations! You won!");
          startOver();
        }, 1000);
      } else {
        setTimeout(() => {
          nextSequence();
        }, 1000);
      }
    } else {
      if (strictMode) {
        setTimeout(() => {
          alert("Wrong pattern! Starting over in strict mode.");
          startOver();
        }, 1000);
      } else {
        setTimeout(() => {
          alert("Wrong pattern! Try again.");
          userPattern = []; // Reiniciar la secuencia del jugador
          /* playPattern(); */ // Reproducir la secuencia nuevamente
        }, 1000);
      }
    }
  }
}

function startOver() {
  gamePattern = [];
  userPattern = [];
  level = 0;
  strictMode = false;
  gamePlaying = false;
  stepDisplay.textContent = "--";
}

startButton.addEventListener("click", () => {
  if (!gamePlaying) {
    startButton.textContent = "Restart";
    nextSequence();
  }
});

strictModeCheckbox.addEventListener("change", () => {
  strictMode = strictModeCheckbox.checked;
});

simonBoard.addEventListener("click", (event) => {
  if (gamePlaying) {
    const color = parseInt(event.target.dataset.color);
    playSound(color);
    animateButton(color);
    userPattern.push(color);
    checkAnswer();
  }
});
