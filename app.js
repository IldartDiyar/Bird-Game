document.addEventListener("DOMContentLoaded", () => {
  const bird = document.querySelector(".bird");
  const gameDisplay = document.querySelector(".game-container");
  const ground = document.querySelector(".ground-moving");
  // const obstacles = [];

  const birdLeft = 220;
  let birdBottom = 100;
  const gravity = 3;
  let isGameOver = false;
  let isPaused = false;
  // let afterPause = false;
  const gap = 430;
  let obstacleGeneratorId;
  let startGameId;

  // let frameCount = 0;
  // let startTime = Date.now();

  function startGame() {
    startGameId = setTimeout(() => {
      birdBottom -= gravity;
      bird.style.bottom = birdBottom + "px";
      bird.style.left = birdLeft + "px";
      // frameCount++;
      // const elapsed = (Date.now() - startTime) / 1000;
      // const fps = Math.round(frameCount / elapsed);
      // console.log(fps);
      startGame();
    }, 20);
  }
  startGame();

  function control(e) {
   if (e.code === "Space" && !isPaused) {
      jump();
    } else if (e.code === "KeyP") {
      togglePause();
    }
  }

  function jump() {
    if (birdBottom < 500) birdBottom += 50;
    bird.style.bottom = birdBottom + "px";
  }
  document.addEventListener("keydown", control);

  function generateObstacle() {
    let obstacleLeft = 500;
    let randomHeight = Math.random() * 60;
    let obstacleBottom = randomHeight;
    const obstacle = document.createElement("div");
    const topObstacle = document.createElement("div");
    if (!isGameOver) {
      obstacle.classList.add("obstacle");
      topObstacle.classList.add("topObstacle");
    }
    gameDisplay.appendChild(obstacle);
    gameDisplay.appendChild(topObstacle);
    obstacle.style.left = obstacleLeft + "px";
    topObstacle.style.left = obstacleLeft + "px";
    obstacle.style.bottom = obstacleBottom + "px";
    topObstacle.style.bottom = obstacleBottom + gap + "px";

    function moveObstacle() {
      let movement = 2
      if (isPaused){
        movement = 0
      }
      obstacleLeft -= movement;
      obstacle.style.left = obstacleLeft + "px";
      topObstacle.style.left = obstacleLeft + "px";

      if (obstacleLeft < -60) {
        clearInterval(timerId);
        if (gameDisplay.contains(obstacle)) {
          gameDisplay.removeChild(obstacle);
        }
        if (gameDisplay.contains(topObstacle)) {
          gameDisplay.removeChild(topObstacle);
        }
      }
      if (
        isCollide(bird, obstacle) ||
        isCollide(bird, topObstacle) ||
        birdBottom < 0
      ) {
        // console.log(gameDisplay.children);
        // console.log(gameDisplay.children.length);
        if (gameDisplay.children.length === 6 && gameDisplay.children[4] !== obstacle && gameDisplay.children[5] != topObstacle ) {
          gameDisplay.removeChild(gameDisplay.children[5]);
          gameDisplay.removeChild(gameDisplay.children[4]);
        }
        gameOver();
        clearInterval(timerId);
        // clearTimeoutafterPause(obstacleGeneratorId);
      }
    }
    // obstacleGeneratorId
    let timerId = setInterval(moveObstacle, 20);
    if (!isGameOver) {
      obstacleGeneratorId = setTimeout(generateObstacle, 3000);
    }
  }

  generateObstacle();

  function gameOver() {
    isGameOver = true;
    document.removeEventListener("keydown", control);
    ground.classList.add("ground");
    ground.classList.remove("ground-moving");
    setTimeout(() => {
      bird.remove();
    }, 1000);
  }
  function togglePause() {
    // console.log(isPaused);
    if (!isPaused) {
      clearTimeout(startGameId);
      clearTimeout(obstacleGeneratorId);
      // document.removeEventListener("keydown", control);
      ground.classList.add("ground");
      ground.classList.remove("ground-moving");
      isPaused = true;
    } else {
      isPaused = false;
      startGame();
      setTimeout(generateObstacle, 3000);
      ground.classList.remove("ground");
      ground.classList.add("ground-moving");
      document.addEventListener("keydown", control);
    }
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
