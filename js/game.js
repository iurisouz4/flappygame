const loadingInterval = 100;

function init() {
  canvas = document.getElementById("gameCanvas");
  scene = new createjs.Stage(canvas);

  messageField = new createjs.Text(
    "Carregando...",
    "bold 26px Helvetica",
    "#FFFFFF"
  );
  messageField.maxWidth = 1000;
  messageField.textAlign = "center";
  messageField.x = canvas.width / 2;
  messageField.y = canvas.height / 2;
  scene.addChild(messageField);
  scene.update();

  var manifest = [
    { id: "bg", src: "img/bg.png" },
    { id: "foreground-trees", src: "img/foreground-trees.png" },
    { id: "mountain-far", src: "img/mountain-far.png" },
    { id: "mountains", src: "img/mountains.png" },
    { id: "trees", src: "img/trees.png" },
    { id: "sonic", src: "img/sonic.png" },
    { id: "enemy", src: "img/enemy.png" },
    { id: "sonicDying", src: "img/sonicdeath-1.png" },
  ];

  preload = new createjs.LoadQueue();
  preload.addEventListener("complete", doneLoading);
  preload.addEventListener("progress", updateLoading);
  preload.loadManifest(manifest);
}

function updateLoading() {
  messageField.text = "Carregando " + ((preload.progress * 100) | 0) + "%";
  scene.update();
}

function doneLoading(event) {
  clearInterval(loadingInterval);
  messageField.text = "Clique para iniciar";
  watchRestart();
}

function watchRestart() {
  canvas.onclick = handleClick;
  scene.addChild(messageField);
  scene.update();
}

function handleClick() {
  scene.removeChild(messageField);
  restart();
}

function restart() {
  scene.removeAllChildren();
  jump = 60;
  isHurt = false;
  canvas.onclick = doJump;

  bgImage = preload.getResult("bg");
  bg = new createjs.Bitmap(bgImage);
  bg.scaleX = 800 / bg.image.width;
  bg.scaleY = 471 / bg.image.height;
  bg.x = 0;
  bg.y = 0;

  mountainFarImage = preload.getResult("mountain-far");
  mountainFar = new createjs.Bitmap(mountainFarImage);
  mountainFar.scaleX = 800 / mountainFar.image.width;
  mountainFar.scaleY = 471 / mountainFar.image.height;
  mountainFar.x = 0;
  mountainFar.y = 0;

  mountainFarImage2 = preload.getResult("mountain-far");
  mountainFar2 = new createjs.Bitmap(mountainFarImage2);
  mountainFar2.scaleX = 800 / mountainFar2.image.width;
  mountainFar2.scaleY = 471 / mountainFar2.image.height;
  mountainFar2.x = 800;
  mountainFar2.y = 0;

  mountainsImage = preload.getResult("mountains");
  mountains = new createjs.Bitmap(mountainsImage);
  mountains.scaleX = 1600 / mountains.image.width;
  mountains.scaleY = 471 / mountains.image.height;
  mountains.x = 0;
  mountains.y = 0;

  mountainsImage2 = preload.getResult("mountains");
  mountains2 = new createjs.Bitmap(mountainsImage2);
  mountains2.scaleX = 1600 / mountains2.image.width;
  mountains2.scaleY = 471 / mountains2.image.height;
  mountains2.x = 1600;
  mountains2.y = 0;

  treesImage = preload.getResult("trees");
  trees = new createjs.Bitmap(treesImage);
  trees.scaleX = 1600 / trees.image.width;
  trees.scaleY = 471 / trees.image.height;
  trees.x = 0;
  trees.y = 0;

  treesImage2 = preload.getResult("trees");
  trees2 = new createjs.Bitmap(treesImage2);
  trees2.scaleX = 1600 / trees2.image.width;
  trees2.scaleY = 471 / trees2.image.height;
  trees2.x = 1600;
  trees2.y = 0;

  foregroundTreesImage = preload.getResult("foreground-trees");
  foregroundTrees = new createjs.Bitmap(foregroundTreesImage);
  foregroundTrees.scaleX = 1600 / foregroundTrees.image.width;
  foregroundTrees.scaleY = 471 / foregroundTrees.image.height;
  foregroundTrees.x = 0;
  foregroundTrees.y = 0;

  foregroundTreesImage2 = preload.getResult("foreground-trees");
  foregroundTrees2 = new createjs.Bitmap(foregroundTreesImage2);
  foregroundTrees2.scaleX = 1600 / foregroundTrees2.image.width;
  foregroundTrees2.scaleY = 471 / foregroundTrees2.image.height;
  foregroundTrees2.x = 1600;
  foregroundTrees2.y = 0;

  sonicImage = preload.getResult("sonic");
  var dataSonic = new createjs.SpriteSheet({
    images: [sonicImage],
    frames: {
      regX: 0,
      height: 64,
      count: 12,
      regY: 0,
      width: 64,
    },
    animations: {
      up: [0, 2, "up"],
      straight: [3, 5, "straight"],
      down: [6, 8, "down"],
      dead: [9, 11, "dead"],
    },
  });
  sonic = new createjs.Sprite(dataSonic, "straight");
  sonic.framerate = 5;
  sonic.x = 50;
  sonic.y = 50;

  sonicDying = null

  enemyImage = preload.getResult("enemy");
  var dataEnemy = new createjs.SpriteSheet({
    images: [enemyImage],
    frames: {
      regX: 0,
      height: 52,
      count: 2,
      regY: 0,
      width: 48,
    },
    animations: { stay: [0, 1, "stay"] },
  });

  enemies = [];
  numEnemies = 8;
  hole = Math.floor(Math.random() * numEnemies);
  for (var i = 0; i < numEnemies; i++) {
    enemies[i] = new createjs.Sprite(dataEnemy, "stay");
    enemies[i].framerate = Math.floor(Math.random() * 8);
    enemies[i].x = 800;
    enemies[i].y = 50 * i - 8;
    if (i > hole) {
      enemies[i].y = enemies[i].y + 100;
    }
  }

  scene.addChild(
    bg,
    mountainFar,
    mountainFar2,
    mountains,
    mountains2,
    trees,
    trees2,
    foregroundTrees,
    foregroundTrees2,
    sonic
  );

  for (var i = 0; i < numEnemies; i++) {
    scene.addChild(enemies[i]);
  }

  scene.update();

  if (!createjs.Ticker.hasEventListener("tick")) {
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.framerate = 60;
  }
}

function tick(event) {
  mountainFar.x = mountainFar.x - 1;
  mountainFar2.x = mountainFar2.x - 1;
  mountains.x = mountains.x - 2;
  mountains2.x = mountains2.x - 2;
  trees.x = trees.x - 4;
  trees2.x = trees2.x - 4;
  foregroundTrees.x = foregroundTrees.x - 6;
  foregroundTrees2.x = foregroundTrees2.x - 6;

  if (mountainFar.x <= -800) {
    mountainFar.x = Math.abs(mountainFar.x);
  }
  if (mountainFar2.x <= -800) {
    mountainFar2.x = Math.abs(mountainFar2.x);
  }
  if (mountains.x <= -1600) {
    mountains.x = Math.abs(mountains.x);
  }
  if (mountains2.x <= -1600) {
    mountains2.x = Math.abs(mountains2.x);
  }
  if (trees.x <= -1600) {
    trees.x = Math.abs(trees.x);
  }
  if (trees2.x <= -1600) {
    trees2.x = Math.abs(trees2.x);
  }
  if (foregroundTrees.x <= -1600) {
    foregroundTrees.x = Math.abs(foregroundTrees.x);
  }
  if (foregroundTrees2.x <= -1600) {
    foregroundTrees2.x = Math.abs(foregroundTrees2.x);
  }

  sonic.y = sonic.y + 3;
  if (sonicDying != null) {
    sonicDying.y = sonicDying.y + 8;
  }

  
  hole = Math.floor(Math.random() * numEnemies);
  for (var i = 0; i < numEnemies; i++) {
    if (enemies[i] != null) {
      enemies[i].x = enemies[i].x - 6;
      if (enemies[i].x < -60) {
        enemies[i].x = 800;
        enemies[i].y = 50 * i - 8;
        if (i > hole) {
          enemies[i].y = enemies[i].y + 100;
        }
      }
    }
  }

  if(!isHurt){
    if (jump > 0) {
        jump = jump - 2;
        if (jump > 10) {
          if (sonic.currentAnimation != "up") {
            sonic.gotoAndPlay("up");
          }
        } else {
          if (sonic.currentAnimation != "straight") {
            sonic.gotoAndPlay("straight");
          }
        }
      } else if (sonic.currentAnimation != "down") {
        sonic.gotoAndPlay("down");
      }
  }
  

  var collision = ndgmr.checkPixelCollision(sonic, enemies[0]);
  var collision = false;
  var i = 0;
  while (!collision && i < numEnemies) {
    var collision = ndgmr.checkPixelCollision(sonic, enemies[i]);
    i++;
  }

  if (collision && !isHurt) {
    canvas.onclick = null;
    isHurt = true;
    die();
  }

  if(sonicDying != null && sonicDying.y >= 471){
    canvas.onclick = handleClick;
  }

  scene.update(event);
}

function doJump() {
  jump = 60;
  sonic.y = sonic.y - jump;
}

function die() {
  console.log("died");
  sonic.gotoAndPlay("dead");
  sonicDyingImage = preload.getResult("sonicDying");
  var dataSonicDying = new createjs.SpriteSheet({
    images: [sonicDyingImage],
    frames: {
      regX: 0,
      height: 64,
      count: 2,
      regY: 0,
      width: 48,
    },
    animations: {
      dead: [0, 0, "dead"],
      hurt: [1, 1, "hurt"],
    },
  });
  sonicDying = new createjs.Sprite(dataSonicDying, "hurt");
  sonicDying.x = sonic.x;
  sonicDying.y = sonic.y;
  //scene.removeChild(sonic)
  scene.addChild(sonicDying);
}
