var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var background , backgroundImage

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  backgroundImage=loadImage("money.jpeg")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("cactus.png");
  obstacle2 = loadImage("car.png");
  obstacle3 = loadImage("mrbeast.png");
  obstacle4 = loadImage("tnt.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("sonido.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
 createCanvas(windowWidth, windowHeight);
   

 trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.9;
  
  ground = createSprite(width/2,height-70,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2)
  restart.addImage(restartImg);
  
  gameOver.scale = 0.8;
  restart.scale = 0.8;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //create grupos de onstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hola" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false
  
  score = 0;
  
}

function draw() {
  background(backgroundImage);
 // background(180);
  //mostrar puntuación
   drawSprites();
  
  console.log("esto es ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //mover el suelo
    jumpSound.play()
    ground.velocityX = -4;
    //puntuación
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el Trex salte al presionar la barra espaciadora
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-250) {
     // jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      //cambiar la animación del Trex
      trex.changeAnimation("collided", trex_collided);
     
      //establecer Lifetime (ciclo de vida) de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     if(mousePressedOver(restart)) { reset(); }
if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
   }
  
 
  //evitar que el Trex caiga
  trex.collide(invisibleGround);
  
  
 // reset()
  //drawSprites();
  fill("white")
  text("Puntuación: "+ score, 500,50);
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-85,20,30);
   obstacle.velocityX =  -(6 + 3*score/100);
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
   //           break;
     // case 5: obstacle.addImage(obstacle5);
      //        break;
      //case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.4;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,40,10);;
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = 134;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar nube al grupo
   cloudsGroup.add(cloud);
    }
}

function reset(){
  //gameOver.visible=false
  //restart.visible=false
  gameState = PLAY; gameOver.visible = false; restart.visible = false; obstaclesGroup.destroyEach(); cloudsGroup.destroyEach(); score = 0;
}