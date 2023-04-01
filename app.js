document.addEventListener("DOMContentLoaded", () => {
  const bird = document.querySelector(".bird");
  const gameDisplay = document.querySelector(".game-container");
  const ground = document.querySelector(".ground-moving");
  const stopMessage = document.querySelector(".stop-message");
  const ScoreBoard = document.getElementById("scoreBoard");
  const timer = document.getElementById("Timer");
  const heart = document.getElementById("heart");
  const Restart = document.getElementById("Restart");
  Restart.onclick = () => {
    location.reload();
  };
  // const obstacles = [];
  let time = 0;
  let score = 0;

  const birdLeft = 220;
  let birdBottom = 100;
  const gravity = 3;
  let isGameOver = false;
  let isPaused = false;

  // let afterPause = false;
  const gap = 430;
  let obstacleGeneratorId;
  let startGameId;
  let startCountingId;

  // let frameCount = 0;
  // let startTime = Date.now();
  let live = 3;

  function startCounting() {
    time = time + 1;
    timer.innerHTML = time;
    startCountingId = setTimeout(startCounting, 1000);
  }
  startCountingId = setTimeout(startCounting, 1000);

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
    } else if (e.code === "KeyP" && !isGameOver) {
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
      let movement = 2;
      if (isPaused || isGameOver) {
        movement = 0;
      }
      obstacleLeft -= movement;
      obstacle.style.left = obstacleLeft + "px";
      topObstacle.style.left = obstacleLeft + "px";
      if (obstacleLeft === 180) {
        score = score + 1;
        ScoreBoard.innerHTML = score;
      }
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
        gameOver();
        clearInterval(timerId);
      }
    }

    let timerId = setInterval(moveObstacle, 20);
    if (!isGameOver) {
      obstacleGeneratorId = setTimeout(generateObstacle, 3000);
    }
  }

  generateObstacle();
  function gameOver() {
    isGameOver = true;
    clearTimeout(startGameId);
    clearTimeout(obstacleGeneratorId);
    clearTimeout(startCountingId);
    document.removeEventListener("keydown", control);
    live = live - 1;
    console.log(live);
    if (live > 0) {
      const obstacles = gameDisplay.querySelectorAll(".topObstacle, .obstacle");

      heart.lastElementChild.style.display = "none";
      heart.removeChild(heart.lastElementChild);
      obstacles.forEach((obstacle) => obstacle.remove());
      birdBottom = 150;
      // bird.style.display = "none";
      // setTimeout(recoverBird(), 1000);
      setTimeout(() => {
        startGame();
        isGameOver = false;
        generateObstacle();
        startCountingId = setTimeout(startCounting, 1500);
        document.addEventListener("keydown", control);
      }, 1500);
      return;
    }
    heart.lastElementChild.style.display = "none";
    heart.removeChild(heart.lastElementChild);

    stopMessage.style.backgroundImage = "url('Daco_2680778.png')";
    stopMessage.innerHTML = "";
    stopMessage.style.display = "block";
    ground.classList.add("ground");
    ground.classList.remove("ground-moving");

    setTimeout(() => {
      bird.remove();
    }, 1000);
  }
  function togglePause() {
    if (!isPaused) {
      clearTimeout(startGameId);
      clearTimeout(obstacleGeneratorId);
      clearTimeout(startCountingId);
      stopMessage.style.display = "block";

      ground.classList.add("ground");
      ground.classList.remove("ground-moving");
      isPaused = true;
    } else {
      isPaused = false;
      startGame();
      setTimeout(generateObstacle, 3000);
      stopMessage.style.display = "none";
      setTimeout(startCounting, 1500);
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
