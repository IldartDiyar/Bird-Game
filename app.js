document.addEventListener("DOMContentLoaded", () => {
  const bird = document.querySelector(".bird");
  const gameDisplay = document.querySelector(".game-container");
  const ground = document.querySelector(".ground");
  const textPause = document.querySelector(".text-pause");
  let birdLeft = 220;
  let birdBottom = 100;
  let gravity = 2;
  let isGameOver = false;
  let gap = 430;
  let gameTimerId;
  let obstacleTimerId;
  let obstacleGeneratorId;
  var scoreBoard = document.getElementById("Score");
  let score = 0;

  function startGame() {
    birdBottom -= gravity;
    bird.style.bottom = birdBottom + "px";
    bird.style.left = birdLeft + "px";
  }

  function control(e) {
    if (e.code === "Space") {
      jump();
    }
    if (e.code === "KeyP") {
      pauseGame();
    }
    if (e.code === "KeyR") {
      resumeGame();
    }
  }
  let obstaclesArr = [];
  function jump() {
    if (birdBottom > 480 || isGameOver) {
      return;
    }
    birdBottom += 50;
    bird.style.birdBottom = birdBottom + "px";
  }

  function generateObstacle() {
    let obstacleLeft = 500;
    let randomHeight = Math.random() * 60;
    let obstacleBottom = randomHeight;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    gameDisplay.appendChild(obstacle);
    obstacle.style.left = obstacleLeft + "px";
    obstacle.style.bottom = obstacleBottom + "px";

    const topObstacle = document.createElement("div");
    topObstacle.classList.add("topobstacle");
    gameDisplay.appendChild(topObstacle);
    topObstacle.style.left = obstacleLeft + "px";
    topObstacle.style.bottom = obstacleBottom + gap + "px";

    obstaclesArr.push({ topObstacle, obstacle });
    // console.log(obstaclesArr);

    function obstacleMove() {
      obstacleLeft -= 2;
      obstacle.style.left = obstacleLeft + "px";
      topObstacle.style.left = obstacleLeft + "px";
      if (obstacleLeft === -60) {
        gameDisplay.removeChild(obstacle);
        gameDisplay.removeChild(topObstacle);
      }
      if (
        isCollide(bird, obstacle) ||
        isCollide(bird, topObstacle) ||
        birdBottom === 0
      ) {
        gameOver();
        clearInterval(obstacleTimerId);
        clearTimeout(obstacleGeneratorId);
      }
    }

    if (isGameOver) {
      return;
    } else {
      score++;
      scoreBoard.innerHTML = score - 1;
    }

    obstacleTimerId = setInterval(obstacleMove, 20);

    obstacleGeneratorId = setTimeout(generateObstacle, 3000);
  }

  function pauseGame() {
    clearInterval(gameTimerId);
    clearInterval(obstacleTimerId);
    clearTimeout(obstacleGeneratorId);
    for (let i = 0; i != obstaclesArr.length; i++) {
      element = obstaclesArr[i];
      console.log(obstaclesArr.length);
      element.obstacle.remove();
      element.topObstacle.remove();
    }
    // obstaclesArr.forEach((element) => {
    //   gameDisplay.removeChild(element.obstacle);
    //   gameDisplay.removeChild(element.topObstacle);

    //   console.log(obstaclesArr.length);
    // });
    textPause.style.visibility = "visible";
    obstaclesArr = [];
    isGameOver = true;
  }

  function resumeGame() {
    isGameOver = false;
    document.addEventListener("keyup", control);
    gameTimerId = setInterval(startGame, 20);
    generateObstacle();
  }

  function gameOver() {
    console.log("Game Over!");
    clearInterval(gameTimerId);
    isGameOver = true;
    document.removeEventListener("keyup", control);
  }

  document.addEventListener("keyup", control);
  gameTimerId = setInterval(startGame, 20);
  generateObstacle();
});
function isCollide(a, b) {
  var aRect = a.getBoundingClientRect();
  var bRect = b.getBoundingClientRect();
  return !(
    aRect.top + aRect.height < bRect.top ||
    aRect.top > bRect.top + bRect.height ||
    aRect.left + aRect.width < bRect.left ||
    aRect.left > bRect.left + bRect.width
  );
}
