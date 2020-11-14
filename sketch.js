//Various global variables used in the game
var monkey , monkey_running,monkey_collided;
var banana ,bananaImage, obstacle, obstacleImage;
var FoodGroup, obstacleGroup;
var score = 0;
var ground;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var survivalTime = 0;
var gameOver, gameOveri;
var restart, restarti;
var fSpeedO, fSpeedF,speed;

function preload(){
  //To preload the different images
  monkey_running =  loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  monkey_collided = loadAnimation("sprite_0.png");
  
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  
  gameOveri = loadImage("gameover.png");
  
  restarti = loadImage("restart.jpg");
}

function setup() {
  createCanvas(400,400);
  
  //To create the monkey sprite
  monkey = createSprite(80,315,20,20);
  monkey.addAnimation("moving",monkey_running);
  monkey.addAnimation("collided",monkey_collided);
  monkey.scale = 0.1;
  //monkey.debug = true;
  monkey.setCollider("circle",0,0,350);
  
  //To make the grund sprite
  ground = createSprite(400,350,900,10);
  
  //To create the various groups
  foodGroup = createGroup();
  obstacleGroup = createGroup();
  
  //To make the game over image
  gameOver = createSprite(200,200,10,10);
  gameOver.addImage(gameOveri);
  
  //To make the restart image
  restart = createSprite(200,300,10,10);
  restart.addImage(restarti);
  restart.scale = 0.3;
  
  //The variable used to make the spawning speeds of the objects
  fSpeedF = 80;
  fSpeedO = 300;
  
  //The variable used to increase the speeds of the objects
  speed = -10;
}


function draw() {
  background("white");
  
  //What happens when the game is in the play mode
  if (gameState === PLAY) {
    //To call the functions which spawn the objects
    spawnFood();
    spawnObstacles();
    
    //To keep increasing the survival time
    survivalTime = survivalTime + Math.round(getFrameRate()/60);
    
    //To make infinte ground
    ground.velocityX = -4;
    ground.x = ground.width/2;
    
    //To make the monkey jummp
    if(keyDown("space")&& monkey.y >= 100) {
        monkey.velocityY = -12;
    }
    
    //To add gravity to the monkey
    monkey.velocityY = monkey.velocityY + 0.8;
    
    //To increase the score when the monkey eats a banana
    if (monkey.isTouching(foodGroup)) {
      foodGroup.destroyEach();
      score = score+1;
    }
    
    //To end the game when monkey touches an obstacle
    if (monkey.isTouching(obstacleGroup)) {
      gameState = END;
    }
    
    //So that the gameover and restart sprites are not visible
    gameOver.visible = false;
    restart.visible = false;
    
  //What happens when the game has ended
  } else if (gameState === END) {
    //To make the monkey stop moving
    monkey.changeAnimation("collided",monkey_collided)
    monkey.velocityY = 0;
    
    //So that the food doesn't move or dissapear
    foodGroup.setLifetimeEach(-1);
    foodGroup.setVelocityXEach(0);
    
    //So that the obstacle doesn't move or dissapear
    obstacleGroup.setLifetimeEach(-1);
    obstacleGroup.setVelocityXEach(0);
    
    //To show the game over and restart sprites
    gameOver.visible = true;
    restart.visible = true;
    
    //To make the game in play mode again when you click on the restart button
    if(mousePressedOver(restart)) {
      reset();
     }
    
    //To make the ground stop moving
    ground.velocityX = 0;
  }
  
  //To make the monkey stand on the ground
  monkey.collide(ground);
  
  //To show the score
  stroke("white");
  textSize(20);
  fill("blue");
  text("Score: "+ score,300,50);
  
  //To show the survival time
  stroke("black");
  textSize(20);
  fill("black");
  text("Survival Time: " + survivalTime,100,50);
  
  //To keep increasing the spawn speed and velocity of the objects
  if (World.frameCount%120 === 0) {
    fSpeedF = fSpeedF -1;
    fSpeedO = fSpeedO -1;
    speed = speed - 1;
  }
  
  //To draw the sprites
  drawSprites();
}

//The reset function to make the game play again
function reset(){
  obstacleGroup.destroyEach();
  foodGroup.destroyEach();
  monkey.changeAnimation("moving",monkey_running);
  gameState = PLAY;
  score = 0;
  survivalTime = 0;
}

//The function to spawn the food 
function spawnFood() {
  if (World.frameCount%fSpeedF === 0) {
    banana = createSprite(390,10,10,10);
    banana.addImage(bananaImage);
    banana.scale = 0.1;
    banana.y = Math.round(random(100,290));
    banana.velocityX = speed;
    banana.lifetime = -40;
    foodGroup.add(banana);
    //banana.debug = true;
    banana.setCollider("circle",0,0,300);
  }
}

//The function to spawn the obstacles
function spawnObstacles() {
  if (World.frameCount%fSpeedO === 0) {
    obstacle = createSprite(390,325,10,10);
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.15;
    obstacle.velocityX = speed;
    obstacle.lifetime = 100;
    obstacleGroup.add(obstacle);
    //obstacle.debug = true;
    obstacle.setCollider("circle",10,10,310);
  }
}