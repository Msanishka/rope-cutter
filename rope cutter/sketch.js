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
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button;
var bunny;
var blink,eat,sad;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 

  bg_sound = loadSound ("sound1.mp3") ;
  sad_sound = loadSound ("sad.wav") ;
  cut_sound = loadSound ("rope_cut.mp3") ;
  eat_sound = loadSound ("eating_sound.mp3") ;
  air_sound = loadSound ("air.wav") ;
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if (isMobile) {
  canW=displayWidth
  canH=displayHeight
  createCanvas(displayWidth+80,displayHeight)
  }
  else{
    canW=displayWidth
    canH=displayHeight
    createCanvas(displayWidth,displayHeight)

  }
  bg_sound.play () ;
  bg_sound.setVolume (0.1) ;
  frameRate(80);

  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(20,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button1 = createImg('cut_btn.png');
  button1.position(330,35);
  button1.size(60,60);
  button1.mouseClicked(drop1);

  button2 = createImg('cut_btn.png');
  button2.position(360,200);
  button2.size(60,60);
  button2.mouseClicked(drop2);

  blower = createImg('balloon.png');
  blower.position(10,250);
  blower.size(150,100);
  blower.mouseClicked(airblow);
  
  mute_btn = createImg('mute.png');
  mute_btn.position(420,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);
  

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;
  bunny = createSprite(170,canH-80,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  rope = new Rope(8,{x:40,y:30});
  rope1 = new Rope(7,{x:370,y:40});
  rope2 = new Rope(4,{x:400,y:225});
  
  ground = new Ground(200,canH,600,20);
  
  fruit = Bodies.circle(300,300,20);
  
  Matter.Composite.add(rope.body,fruit);
  Matter.Composite.add(rope1.body,fruit);
  Matter.Composite.add(rope2.body,fruit) ;

  fruit_con = new Link(rope,fruit);
  fruit_con1 = new Link(rope1,fruit);
  fruit_con2 = new Link(rope2,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,displayWidth/2,displayHeight/2,displayWidth+80,displayHeight);

  ground.show();

  rope.show();
  rope1.show();
  rope2.show();
  if (fruit != null) {
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
 
  Engine.update(engine);
   if (collided(fruit,bunny)== true) {
   bunny.changeAnimation("eating") ;
   eat_sound.play() ;
   }
   if (collided(fruit,ground.body)== true) {
    bunny.changeAnimation("crying") ;
    sad_sound.play () ;
    bg_sound.stop() ;
    }

   drawSprites();
}

function drop()
{
  cut_sound.play () ;
  rope.break();
  fruit_con.detach();
  fruit_con = null; 
}

function drop1()
{
  cut_sound.play () ;
  rope1.break();
  fruit_con1.detach();
  fruit_con1 = null; 
}

function drop2()
{
  cut_sound.play () ;
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null; 
}

function collided(body,sprite) {
  if (body != null) {
  var d = dist (body.position.x , body.position.y,sprite.position.x,sprite.position.y) 
  if (d <= 80) {
   World.remove (engine.world,fruit) ;
   fruit = null
   return  true ;

  }
  else {
    return false ;
  }
  }
}

function airblow () {
Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.03,y:0}) ;
air_sound.play () ;
air_sound.setVolume (0.5) ;
}

function mute () {
 if (bg_sound.isPlaying()) {
  bg_sound.stop () ;
 }
 else{
   bg_sound.play() ;
 }

}