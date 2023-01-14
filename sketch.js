const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground, fruit, rope, fruit_con;

var bg_img;
var food;
var bunny_img;

var button;
var bunny;
var blink, eat, sad;

var bgsound, sadsound, cutsound, eatingsound, airsound;
var mutebutton

var blowerbtn



function preload(){
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  bunny_img = loadImage('rabbit-01.png');
  blink = loadAnimation('blink_1.png', 'blink_2.png','blink_3.png');
  eat = loadAnimation('eat_0.png', 'eat_1.png','eat_2.png','eat_3.png','eat_4.png');
  sad = loadAnimation('sad_1.png','sad_2.png','sad_3.png');

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping = false;
  eat.looping = false;

  bgsound = loadSound('sound1.mp3');
  sadsound = loadSound('sad.wav');
  cutsound = loadSound('rope_cut.mp3');
  eatingsound = loadSound('eating_sound.mp3');
  airsound = loadSound('air.wav');
}

function setup() {
  createCanvas(600,700);
  frameRate(80);
  
  engine = Engine.create();
  world = engine.world;

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bgsound.play();
  bgsound.setVolume(0.5);


  button = createImg('cut_btn.png');
  button.position(200,30);
  button.size(50,50);
  button.mouseClicked(drop);

  mutebutton = createImg('mute.png')
  mutebutton.position(500,50);
  mutebutton.size(50,50);
  mutebutton.mouseClicked(mute);

  blowerbtn = createImg('balloon.png');
  blowerbtn.position(50, 200);
  blowerbtn.size(100,100);
  blowerbtn.mouseClicked(airblow);

  ground = new Ground(300, 680, 650, 20);

  bunny = createSprite(350,620,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);

  bunny.changeAnimation("blinking");


  rope = new Rope(6, {x:220, y:30});

  fruit = Bodies.circle(300, 350, 20);
  Matter.Composite.add(rope.body, fruit);
  fruit_con = new Link(rope, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);

}

function draw() {
  background(51);
  image(bg_img,0,0,displayWidth+80,displayHeight);

  push();
  imageMode(CENTER);
  if(fruit!= null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  Engine.update(engine);

  ground.show();
  rope.show();

  if(collide(fruit, bunny)== true){
    bunny.changeAnimation('eating');
    eatingsound.play();

  }

  if(fruit != null && fruit.position.y >= 650){
    bunny.changeAnimation('crying');
    sadsound.play();
    bgsound.stop();
    fruit = null
  }

  drawSprites();

  
}

function drop()
{
  rope.break();
  fruit_con.detach();
  fruit_con = null;
  cutsound.play();
}


function collide(body, sprite)
{
  if(body != null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if(d <= 80){
      World.remove(world, fruit);
      fruit = null
      return true

    } else{
      return false
    }
  }
}

function mute(){
  if(bgsound.isPlaying()){
    bgsound.stop();
  } else{
    bgsound.play();
  }

}

function airblow(){
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0.01, y:0});
  airsound.play();
}
