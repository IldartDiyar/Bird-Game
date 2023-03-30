document.addEventListener("DOMContentLoaded", () => {
  const bird = document.querySelector(".bird");
  const gameDisplay = document.querySelector(".game-container");
  const ground = document.querySelector(".ground");
  let birdLeft = 220;
  let birdBottom = 100;
  let gravity = 2;
  let isGameOver = false;
  let gap = 430;

  function startGame() {
    birdBottom -= gravity;
    bird.style.bottom = birdBottom + "px";
    bird.style.left = birdLeft + "px";
  }

  let gameTimerId = setInterval(startGame, 20);

  function control(e) {
    if (e.code === "Space") {
      jump();
    }
  }

  function jump() {
    if (birdBottom > 480) {
      return;
    }
    birdBottom += 50;
    bird.style.birdBottom = birdBottom + "px";
  }

  document.addEventListener("keyup", control);

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

    function obstacleMove() {
      obstacleLeft -= 2;
      obstacle.style.left = obstacleLeft + "px";
      topObstacle.style.left = obstacleLeft + "px";
      if (obstacleLeft === -60) {
        clearInterval(timerId);
        gameDisplay.removeChild(obstacle);
        gameDisplay.removeChild(topObstacle);
      }

      if (
        isCollide(bird, obstacle) ||
        isCollide(bird, topObstacle) ||
        birdBottom === 0
      ) {
        gameOver(generatorObsTimeId, timerId);
      }
    }
    let timerId = setInterval(obstacleMove, 20);
    let generatorObsTimeId = setTimeout(generateObstacle, 3000);
  }
  generateObstacle();

  function gameOver(generatorObsTimeId, timerId) {
    console.log("asd");
    clearInterval(gameTimerId);
    clearTimeout(generatorObsTimeId);
    clearInterval(timerId);
    isGameOver = true;
    document.removeEventListener("keyup", control);
  }
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
