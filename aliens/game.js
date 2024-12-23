const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startGame");
const scoreDisplay = document.getElementById("score");
const restartModal = document.getElementById("restartModal");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartGame");
const endButton = document.getElementById("endGame");
const gamePage = document.getElementById("gamePage");
const documentation = document.getElementById("documentation");

canvas.width = 800;
canvas.height = 600;

let player, bullets, aliens, score, gameRunning, alienImages, playerImage, difficulty, hardAlienCount, gameLoop;

const loadImages = () => {
  alienImages = {
    normal: new Image(),
    hard: new Image()
  };
  alienImages.normal.src = './images/alien.png';
  alienImages.hard.src = './images/hardAlien.png';

  playerImage = new Image();
  playerImage.src = './images/user.png';
};

class Player {
  constructor() {
    this.width = 50 + (difficulty * 10); 
    this.height = 50 + (difficulty * 10);
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 10;
  }

  draw() {
    ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
  }
}

class Bullet {
  constructor(x, y) {
    this.width = 5;
    this.height = 10;
    this.x = x;
    this.y = y;
    this.color = "red";
  }

  update() {
    this.y -= 5;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Alien {
  constructor(x, y, isHard = false) {
    this.width = 40 + (difficulty * 5);
    this.height = 40 + (difficulty * 5);
    this.x = x;
    this.y = y;
    this.isHard = isHard;
    this.color = this.isHard ? 'red' : 'green';
    this.direction = Math.random() > 0.5 ? 1 : -1;
  }

  update() {
    this.x += this.direction * 2;
    if (this.x <= 0 || this.x + this.width >= canvas.width) {
      this.direction *= -1;
      this.y += 20;
    }
  }

  draw() {
    ctx.drawImage(this.isHard ? alienImages.hard : alienImages.normal, this.x, this.y, this.width, this.height);
  }
}

function initGame() {
  loadImages();
  difficulty++;
  hardAlienCount++;

  player = new Player();
  bullets = [];
  aliens = [];
  score = 0;
  gameRunning = true;

  const alienRows = Math.floor(Math.random() * 5) + 3;
  const alienCols = Math.floor(Math.random() * 7) + 6;

  for (let i = 0; i < alienRows; i++) {
    for (let j = 0; j < alienCols; j++) {
      aliens.push(new Alien(j * (60 + difficulty * 2) + 20, i * (60 + difficulty * 2) + 20));
    }
  }

  for (let i = 0; i < hardAlienCount; i++) {
    aliens.push(new Alien(Math.random() * (canvas.width - 40), 20, true));
  }

  gameLoop = requestAnimationFrame(animate); // Save the reference to stop the loop later
}

function animate() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.draw();

  bullets.forEach((bullet, index) => {
    bullet.update();
    bullet.draw();

    if (bullet.y + bullet.height < 0) {
      bullets.splice(index, 1);
    }
  });

  aliens.forEach((alien, alienIndex) => {
    alien.update();
    alien.draw();

    bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x < alien.x + alien.width &&
        bullet.x + bullet.width > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + bullet.height > alien.y
      ) {
        aliens.splice(alienIndex, 1);
        bullets.splice(bulletIndex, 1);
        score += 10;
        scoreDisplay.textContent = score;
      }
    });

    if (
      alien.x < player.x + player.width &&
      alien.x + alien.width > player.x &&
      alien.y < player.y + player.height &&
      alien.y + alien.height > player.y
    ) {
      gameRunning = false;
      alert("Game Over! Your Score: " + score);
    }
  });

  if (aliens.length === 0) {
    gameRunning = false;
    finalScore.textContent = score;
    restartModal.style.display = 'block';
  }

  gameLoop = requestAnimationFrame(animate); // Keep updating the game loop
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) {
    player.x -= 10;
  } else if (e.key === "ArrowRight" && player.x + player.width < canvas.width) {
    player.x += 10;
  } else if (e.key === " " || e.key === "Spacebar") {
    bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
  }
});

startButton.addEventListener("click", () => {
  documentation.style.display = 'none';
  gamePage.style.display = 'block';
  difficulty = 0;
  hardAlienCount = 1;
  initGame();
});

restartButton.addEventListener("click", () => {
  restartModal.style.display = 'none';
  initGame();
});

// End Game function
function endGame() {
  gameRunning = false;  // Stop the game
  cancelAnimationFrame(gameLoop); // Stop the animation loop
  gamePage.style.display = 'none';  // Hide the game page
  documentation.style.display = 'block';  // Show the documentation page
  alert("Game Ended! Your Score: " + score);  // Show the score
}

endButton.addEventListener("click", () => {
  endGame();  // Call endGame when the button is clicked
});


function searchGoogle(query) {
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(googleSearchUrl, '_blank');
}

function initSlider(containerSelector) {
  const container = document.querySelector(containerSelector);
  const images = container.querySelectorAll('img');
  let currentIndex = 0;

  function showNextImage() {
      images[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
  }

  setInterval(showNextImage, 3000); // Change image every 3 seconds
}

// Initialize sliders
document.addEventListener('DOMContentLoaded', () => {
  initSlider('.alien-images');
  document.querySelectorAll('.slider').forEach(slider => {
      initSlider(`#${slider.closest('section').id} .slider`);
  });
});