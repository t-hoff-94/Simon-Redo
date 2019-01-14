const powerButton = document.querySelector('#power');
const startButton = document.querySelector('#start');
const strictButton = document.querySelector('#strict');
const displayScreen = document.querySelector('.screen');
const squareCtr = document.querySelector('.square-container');
const errorSound = document.querySelector('[data-sound="error"]');

const gameState = {
  powerOn: false,
  level: 0,
  userTurn: false,
  strictMode: false,
  levelHistory: [],
  computerInput: [],
  userInput: [],
  userError: false,
  strictMode: false
}

powerButton.addEventListener('click', function() {
  if(!gameState.powerOn) {
    this.classList.add('power--active');
    gameState.powerOn = true;
  } else {
    powerOff();
  }
});

startButton.addEventListener('click', async function() {
  if(gameState.powerOn && gameState.level === 0) {
    startButton.classList.add('start--active');
    countDown();
  }
});

strictButton.addEventListener('click', function() {
  if(gameState.powerOn){
    if(!gameState.strictMode) {
      gameState.strictMode = true;
      this.classList.add('strict--active');
    } else {
      gameState.strictMode = false;
      this.classList.remove('strict--active');
    }
  }
});
//square buttons
Array.from(squareCtr.querySelectorAll('.square')).forEach(square => {
  square.addEventListener('click', squareClick)
})

function powerOff() {
  gameState.powerOn = false;
  gameState.level = 0;
  gameState.userTurn = false;
  powerButton.classList.remove('power--active');
  startButton.classList.remove('start--active');
}

function startLevel() {
  if(!gameState.userError) {
    addRandomNum();
    gameState.level++
  }
  displayScreen.textContent = gameState.level;
  computerTurn();
}

function squareClick() {
  const cInput = gameState.computerInput;
  const uInput = gameState.userInput;
  if(gameState.userTurn && uInput.length < cInput.length) {
    const id = this.dataset.key;
    gameState.userInput.push(id);
    compare(id);
  }
}

function compare(id) {
  let index = 0;
  gameState.userInput.forEach(input => {
    if(parseInt(input) !== gameState.computerInput[index]) {
      runError(id);
      gameState.userError = true;
    }
    index++
  });
  if(!gameState.userError) {
    animate(id);
  }
  if(gameState.computerInput.length === gameState.userInput.length) {
    gameState.userInput = [];
    setTimeout(()=> startLevel(), 500);
  }
}

function runError(id) {
  animateError(id);
  gameState.userTurn = false;
  if(!gameState.strictMode) {
    setTimeout(()=> playComputerSequence(), 500);
  } else {
    gameState.level = 1;
    gameState.userInput = [];
    gameState.computerInput = [];
    addRandomNum();
    setTimeout(()=> startLevel(), 500);
  }
}

function computerTurn() {
  gameState.userTurn = false;
  playComputerSequence();
}

function playComputerSequence() {
  let i = 0;
  const interval = setInterval(()=>{
    id = gameState.computerInput[i];
    animate(id);
    i++;
    if(i === gameState.computerInput.length) {
      clearInterval(interval);
      gameState.userTurn = true;
      gameState.userError = false;
      gameState.userInput = [];
    }
  }, 1000);
}

function animate(id) {
  let currentSquare = document.querySelector(`[data-key="${id}"]`);
  currentSquare.style.opacity = '1.0';
  playSound(id);


  setTimeout(function() {
    currentSquare.style.opacity = '0.5';
  }, 500);
}

function animateError() {
  errorSound.playbackRate = 2;
  errorSound.play();
  errorSound.currentTime = 0;
}

function playSound(id) {
  const sounds = document.querySelectorAll('audio');
  sounds.forEach(sound => sound.currentTime = 0);
  let currentSound = document.querySelector(`[data-sound="${id}"]`);
  currentSound.play();
}

function addRandomNum() {
  let randomNum = (Math.floor(Math.random() * 4) + 1);
  gameState.computerInput.push(randomNum);
}

function countDown() {
  let start = 4;
  const interval = setInterval(() => {
    start--;
    if(start > 0) {
      displayScreen.textContent = start;
    } else {
      clearInterval(interval);
      startLevel();
    }
  }, 500);
}
