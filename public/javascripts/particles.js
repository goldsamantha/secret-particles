// Global Vars
var max_dist = 6;
var max_d_onmouse = 50;
var max_velocity = 2;
var max_per_frame = 2;
var max_radius = 3;
var particleList = [];
var mousePos = new Vector(-8,-8);
var mouseRange = 28;
var resetAnim = false;
var initKeyup = true;
var framerate = 55;
var changeMouse = true;
var selfDest = false;




var cnv = document.getElementById('cnv');
var ctx = cnv.getContext('2d');



var randRange = function(max,min){
  return Math.floor(Math.random()*(max-min)+min);
}

var rand = function(max){
  return Math.floor(Math.random()*max);
}


function Vector(x,y){
  this.x = x || 0;
  this.y = y || 0;
}

// Add a vector to another
Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
}

// Gets the length of the vector
Vector.prototype.getMagnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

// Gets the angle accounting for the quadrant we're in
Vector.prototype.getAngle = function () {
  return Math.atan2(this.y,this.x);
};

// Allows us to get a new vector from angle and magnitude
Vector.fromAngle = function (angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};









function Particle(point, velocity, acceleration) {
  var pos = point || new Vector(0,0);
  // console.log("Position: x: "+pos.x+"y: "+pos.y);
  this.position = point || new Vector(0, 0);
  this.velocity = velocity || new Vector(0, 0);
  this.acceleration = acceleration || new Vector(0, 0);
  this.radius = randRange(1, max_radius);
  this.home = new Vector(pos.x, pos.y); // || new Vector(0,0);
  this.dist = max_dist;
  this.onJourney = false;
  this.movingOut = false;
  this.breakdown = false;
}



var makeRect = function(x1,y1,x2,y2){
  ctx.beginPath();
  ctx.rect(x1, y1, x2, y2);
 //  context.fillStyle = 'yellow';
 //  context.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  ctx.stroke();

}


Particle.prototype.move = function () {
 // Add our current acceleration to our current velocity
 this.velocity.add(this.acceleration);

 var minx = this.home.x - this.dist;
 var maxx = this.home.x + this.dist;
 var x = this.velocity.x + this.position.x;

 var miny = this.home.y - this.dist;
 var maxy = this.home.y + this.dist;
 var y = this.velocity.y + this.position.y;


 var rangeMinX = this.home.x - max_dist;
 var rangeMaxX = this.home.x + max_dist;

 var rangeMinY = this.home.y - max_dist;
 var rangeMaxY = this.home.y + max_dist;


 //applies 30% probability;
 var randomX = (rand(10)>7);
 var randomY = (rand(10)>7);


 if (this.onJourney){
   var out_of_bounds =  ( !inRange(minx, maxx, x) ||  !inRange(miny, maxy, y) );
   var inSmallHome = ( inRange(rangeMinX, rangeMaxX, x) && inRange(rangeMinY, rangeMaxY, y) );

   if (out_of_bounds){
     this.velocity.x = this.velocity.x*(-1);
     this.velocity.y = this.velocity.y*(-1);
     this.position.add(this.velocity);
     this.position.add(this.velocity);
     this.movingOut = false;
   }
   else if ( !this.movingOut && inSmallHome){
     this.onJourney = false;
     this.dist = max_dist;
   }


 }

 else if (this.breakdown) {
   this.dist = max_d_onmouse;
   if (randomX){
     this.velocity.x = this.velocity.x*(-1);
   }

   if (randomY){
     this.velocity.y = this.velocity.y*(-1);
   }
 }





 else{
   // STANDARD FUNCTIONALITY:
   if ( !inRange(minx, maxx, x) || (randomX) ){
     this.velocity.x = this.velocity.x*(-1);
   }
   if ( !inRange(miny, maxy, y) || randomY){

     this.velocity.y = this.velocity.y*(-1);
   }
}


 // Add our current velocity to our position
 this.position.add(this.velocity);
};

function inRange(lower, upper, elem){
  if ( (lower < elem) && (upper> elem) ){
    return true;

  }
  else{ return false;}
}




/*
Mouse move stuff

*/

function setMousePos(canvas, evt){
  var rect = canvas.getBoundingClientRect();
  if (changeMouse){
    mousePos.x = (evt.clientX - rect.left);
    mousePos.y = (evt.clientY - rect.top);
  }
}

function setMouseOverController(bool) {
  changeMouse = bool;
}

function selfDestruct(){
  selfDest = true;
}


if(changeMouse){

  cnv.addEventListener('mousemove', function(evt){
    setMousePos(cnv, evt);
  }, false);

}



/*
Takes in list of point objects, and generates a list of
particle objects of numParts length taken from randomly
selected nodes in the particle list;

*/
var generateParticles = function(pointList, numParts){
  var cpy = pointList.slice();
  // console.log("Length After: "+cpy.length);
  for (var z=0; z<numParts; z++){
    var coord_index = rand(cpy.length);
    var coord = cpy.splice(coord_index, 1);
    coord = coord[0];
    x = coord[0];
    y = coord[1];
    var vect = new Vector(x,y);
    var vel = new Vector(randRange(1,max_velocity+1),randRange(1, max_velocity +1));

    var part = new Particle(vect, vel);
    particleList.push(part);


  }

}




var makeShape = function(x,y, rad){
    ctx.beginPath();
    ctx.arc(x,y, rad, 0, 2*Math.PI, false);
    ctx.rect(x, y, 2, 2);
    ctx.fillStyle= "#fff";
    ctx.fill();
}



var draw = function(particles){
  for (var z=0; z<particles.length; z++){
    var x = particles[z].position.x;
    var y = particles[z].position.y;
    var part = particles[z];


    homex = x;
    homey = y;
    var xInRange =  inRange(mousePos.x- mouseRange, mousePos.x+mouseRange, homex);
    var yInRange = inRange(mousePos.y- mouseRange, mousePos.y+mouseRange, homey);

    if (xInRange && yInRange){
      particles[z].dist = max_d_onmouse;
      particles[z].onJourney = true;
      particles[z].movingOut = true;
    }

    if (selfDest){
      particles[z].onJourney = false;
      particles[z].movingOut = false;
      particles[z].breakdown = true;

    }



    particles[z].move();

    x = particles[z].position.x;
    y = particles[z].position.y;
    makeShape(x, y, particles[z].radius);
  }
}



function loop(){
  clearCanv();
  draw(particleList);
  queue();

}



function queue() {


  if (resetAnim == false){
    window.setTimeout(loop, framerate);
  }
  else{
    // console.log("Resetting Anim");
    resetAnim = false;
  }
  // console.log("Frame Rate: "+framerate);
}

function clearCanv() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
}





// var txt = document.getElementById('message').innerHTML; //"Type";

// startSim(txt);

function changeText() {
  if (initKeyup == true){
    cnv.width = window.innerWidth;

    initKeyup = false;
    return;
  }
  var x = document.getElementById("fname").value;
  txt = x;
  resetAnim = true;
  startSim(txt);


}



function startSim(words){

clearCanv();

if (window.innerWidth < cnv.width){
  cnv.width = window.innerWidth;
}

//Font family selection
ctx.font = "normal 100pt sans-serif";
ctx.fillStyle="black";
ctx.fillText(words, 0 , 200);

var imgData = ctx.getImageData(0,0, cnv.width, cnv.height);
var data = imgData.data;
// console.log("Data size: "+data.length);


var imageHeight = cnv.height;
var imageWidth = cnv.width;

// console.log("WIDTH: "+imageWidth+" HEIGHT: "+imageHeight);

var points=[];

for (var i=0; i<data.length; i++){
  if (data[i]==255){
    var x, y;
    x =  Math.floor(i/4)%imageWidth;
    y = Math.floor(Math.floor(i/4)/imageWidth);
    points.push([x,y]);
  }
}

ctx.clearRect(0,0,imageWidth, imageHeight);
particleList = [];
generateParticles(points, points.length/15);
loop();

}
