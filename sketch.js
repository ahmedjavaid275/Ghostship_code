
let score = 0;
let duration = 30;
let startTime;
let bonusTime = 0;
let state = "start";
let spawnEvery = 60;

let ghost;
let redGhost;
let zombie;

function setup() {
  createCanvas(480, 360);
  textFont("Arial");
  spawnGhost();
}

// Main game loop
function draw() {
  background("#47103b");

  if (state === "start") {
    textAlign(CENTER, CENTER);
    fill(255, 240, 200);
    textSize(32);
    text("👻 GHOST HUNT", width / 2, 120);
    textSize(18);
    fill(255);
    text("Click to start!", width / 2, 190);
    return;
  }

  if (state === "over") {
    textAlign(CENTER, CENTER);
    fill(255, 240, 200);
    textSize(32);
    text("GAME OVER!", width / 2, 120);
    fill(255);
    textSize(22);
    text("Your Score: " + score, width / 2, 175);
    textSize(16);
    text("Click to play again", width / 2, 225);
    return;
  }

  // Timer including zombie bonus
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, duration + bonusTime - elapsed);

  if (timeLeft <= 0) {
    state = "over";
    return;
  }

  // Spawn all creatures every 60 frames
  if (frameCount % spawnEvery === 0) {
    spawnGhost();
  }

  // Draw creatures
  drawGhost(ghost.x, ghost.y);
  drawRedGhost(redGhost.x, redGhost.y);
  drawZombie(zombie.x, zombie.y);

  // Score
  textAlign(LEFT, TOP);
  fill(255);
  textSize(18);
  text("Score: " + score, 12, 10);

  // Timer
  textAlign(RIGHT, TOP);
  text("Time: " + ceil(timeLeft), width - 12, 10);
}

// Check that creatures do not overlap
function safePosition(existing) {
  let pos;
  let attempts = 0;

  do {
    pos = {
      x: random(40, width - 40),
      y: random(75, height - 40)
    };
    attempts++;
  } while (
    existing.some(other =>
      dist(pos.x, pos.y, other.x, other.y) < 80
    ) && attempts < 100
  );

  return pos;
}

// Spawn all creatures safely
function spawnGhost() {
  ghost = safePosition([]);

  redGhost = safePosition([ghost]);

  zombie = safePosition([ghost, redGhost]);
}

// Spawn only normal ghost
function spawnNormalGhost() {
  ghost = safePosition([redGhost, zombie]);
}

// Spawn only red ghost
function spawnRedGhost() {
  redGhost = safePosition([ghost, zombie]);
}

// Spawn only zombie
function spawnZombie() {
  zombie = safePosition([ghost, redGhost]);
}

// Normal ghost
function drawGhost(x, y) {
  noStroke();
  fill(220, 255, 230);
  ellipse(x, y, 60, 60);

  triangle(x - 30, y + 10, x + 30, y + 10, x, y + 40);

  fill(20);
  ellipse(x - 12, y - 5, 10, 13);
  ellipse(x + 12, y - 5, 10, 13);
  ellipse(x, y + 12, 8, 10);
}

// Red ghost
function drawRedGhost(x, y) {
  noStroke();
  fill(255, 30, 30);
  ellipse(x, y, 60, 60);

  triangle(x - 30, y + 10, x + 30, y + 10, x, y + 40);

  fill(20);
  ellipse(x - 12, y - 5, 10, 13);
  ellipse(x + 12, y - 5, 10, 13);
  ellipse(x, y + 12, 8, 10);
}

// Zombie creature
function drawZombie(x, y) {
  noStroke();

  // Green zombie head
  fill(90, 190, 65);
  rectMode(CENTER);
  rect(x, y, 52, 55, 10);

  // Hair
  fill(35, 65, 30);
  rect(x, y - 29, 50, 8);

  // Eyes
  fill(255);
  ellipse(x - 11, y - 7, 12, 12);
  ellipse(x + 11, y - 7, 12, 12);

  fill(20);
  ellipse(x - 11, y - 7, 5, 7);
  ellipse(x + 11, y - 7, 5, 7);

  // Mouth
  fill(40);
  rect(x, y + 12, 23, 6);

  // Teeth
  fill(255);
  rect(x - 6, y + 12, 4, 6);
  rect(x + 6, y + 12, 4, 6);

  // Reset rectangle mode
  rectMode(CORNER);
}

// Mouse click controls
function mousePressed() {

  // Start or restart
  if (state === "start" || state === "over") {
    state = "play";
    score = 0;
    bonusTime = 0;
    startTime = millis();
    spawnGhost();
    return;
  }

  // Normal ghost: +1 point
  if (dist(mouseX, mouseY, ghost.x, ghost.y) < 30) {
    score++;
    spawnNormalGhost();
  }

  // Red ghost: +5 points
  else if (dist(mouseX, mouseY, redGhost.x, redGhost.y) < 30) {
    score += 5;
    spawnRedGhost();
  }

  // Zombie: +5 seconds
  else if (dist(mouseX, mouseY, zombie.x, zombie.y) < 30) {
    bonusTime += 5;
    spawnZombie();
  }
}
