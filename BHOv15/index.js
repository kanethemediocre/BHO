var Umo = require('./umo.js');
var Bling = require('./bling.js'); 
var System = require('./system.js');
var loadhomesystem = require('./homesystem.js');
var systems = [0,new System(1,"Sool",0,0)]//constructor(index, name, x, y){
systems[1].planets = loadhomesystem();
systems[1].addrandombling(100);
systems[1].enemypopulate(3,0,0);
//enemypopulate(num,minlevel,maxlevel){ 
var sys = 1;
var liteplanets = [];
var i=0;
while(i<systems[sys].planets.length){
  var px = systems[sys].planets[i].x;
  var py = systems[sys].planets[i].y;
  var pvx = systems[sys].planets[i].vx;
  var pvy = systems[sys].planets[i].vy;
  var pvs = systems[sys].planets[i].s;
  var pvc1 = systems[sys].planets[i].c;
  var pvc2 = systems[sys].planets[i].c2;
  var pname = systems[sys].planets[i].name;
  liteplanets.push([px,py,pvx,pvy,pvs,pvc1,pvc2,pname]);
  i++;
}
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const playercolors = ["red","darkred","green","aqua","navy","blue","purple","deeppink","brown","darkgreen","indigo","lime","white"];
const xsize = 1024;
const ysize = 768;
const safex = 200; //size not location.
const safey = 200;
var maxspeed = 10;
var time=0;

class User{
  constructor(name,id){
    this.name = name;
    this.id = id;
    this.s = new Umo(-100,-100,32,"tan");//constructor(xxx, yyy, sss, ccc) {
    this.s.parentid = 3; //respawn in earf orbit
    this.s.hp = 400;
    this.s.maxhp = 400;
    this.s.shield = 200;
    this.s.maxshield = 200;
    this.bs = new Umo(-100,-100,8,"magenta");// this.s is player sprite, this.bs is bomb sprite
    this.bs.hurt = 16;
    //this.es = new Sprite(-100,-100,32,"orange");// this.es is the bomb explosion
    this.input = -1;
    this.mousestate = 0;
    this.score = 0;
  }
}
class Userlist{
  constructor(users){
    this.users = users;
  }
  getname(userid){
    var i=0;
    var username = "Not found";
    while (i<this.users.length){
      if (this.users[i].id == userid){
        username = this.users[i].name;
        i = this.users.length;
      }
      i++;
    }
    return username;
  }
  setname(newname,userid){//needs failsafe
    var i=0;
    var success = false;
    while (i<this.users.length){
      if (this.users[i].id == userid){
        this.users[i].name = newname;
        i = this.users.length;
        success = true;
      }
      i++;
    }
    return success;
  }
  getcolor(userid){
    var i=0;
    var usercolor = "tan";
    while (i<this.users.length){
      if (this.users[i].id == userid){
        usercolor = this.users[i].s.c;
        i = this.users.length;
      }
      i++;
    }
    return usercolor;
  }
  setcolor(newcolor,userid){//needs failsafe
    var i=0;
    while (i<this.users.length){
      if (this.users[i].id == userid){
        this.users[i].s.c = newcolor;
        i = this.users.length;
      }
      i++;
    }
  }
  setinput(newinput,userid){//needs failsafe
    var i=0;
    while (i<this.users.length){
      if (this.users[i].id == userid){
        this.users[i].input = newinput;
        i = this.users.length;
      }
      i++;
    }
  }
  getindex(userid){
    var i=0;
    var userindex = "-1";//Deliberate error to make problem visible on function failure
    while (i<this.users.length){
      if (this.users[i].id == userid){
        userindex = i;
        i = this.users.length;
      }
      i++;
    }
    return userindex;
  }
}
var allusers = new Userlist([]);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT,'192.168.4.60');//server ip goes here
io.on('connection', (socket) => { 
  var theid = socket.id;
  var newuser = new User("Cactus Fantastico",theid);//Setting name, not really used
  var randomplayercolor = playercolors[Math.floor(Math.random()*playercolors.length)];
  allusers.users.push(newuser);
  allusers.setcolor(randomplayercolor,theid);
  io.to(theid).emit('whoami', allusers.getindex(theid));//tell client what index they are
  allusers.users[allusers.getindex(theid)].s.setorbit(systems[sys].planets[3],500,0,1);
  io.to(theid).emit('newlevel', [liteplanets,[]]);//tell client about planets
  socket.on('disconnect', () => {
      allusers.users.splice(allusers.getindex(theid), 1);//remove defunct users here
      var i=0;
      while (i<allusers.users.length){
        io.to(allusers.users[i].id).emit('whoami', i);
        i++;
      }
   });
  socket.on('gameinput', (input) => {
    var theid = socket.id;
    allusers.setinput(input,theid);
  });
  socket.on('mouseinput', (mouseinput) => {
    var theid = socket.id;
    var thei = allusers.getindex(theid);
    allusers.users[thei].s.d = mouseinput[0];
    allusers.users[thei].mousestate = mouseinput[1];
  });
});

const FPS = 30;
setInterval(update, 1000 / FPS);    		// set up interval (game loop)
function update() { //game loop

  var updatescorearray = [];
  var updateplanetsarray = [];
  var updateplayersarray = [];
  var updateplayerbombsarray = [];
  var updateblingarray = [];
  var updatenmeshipsarray = [];
  var updatebotbombsarray = [];

  


  //Planet update and array exporting/////////////////////////////////////////////////////////////////////
  updateplanetsarray.push([systems[sys].planets[0].x,systems[sys].planets[0].y,systems[sys].planets[0].vx,systems[sys].planets[0].vy]);//add sun to array
  var i=1;//for all not-sun planets
  while (i<systems[sys].planets.length){
    systems[sys].planets[0].gravitate(systems[sys].planets[i]);//sun pulls the planet
    if (systems[sys].planets[i].parentid!=0){//other planet pulls planet if the planet is a moon.
      systems[sys].planets[systems[sys].planets[i].parentid].gravitate(systems[sys].planets[i]);
    }
    systems[sys].planets[i].update1();//planet gets updated
    updateplanetsarray.push([Math.floor(systems[sys].planets[i].x),Math.floor(systems[sys].planets[i].y),Math.floor(100*systems[sys].planets[i].vx)/100,Math.floor(100*systems[sys].planets[i].vy)/100]);
    i++;
  }
  ///Bling update / gravitate and stuff
  var i=0;//for all not-sun planets
  while (i<systems[sys].planets.length){//all planets
    var j=0;
    while(j<systems[sys].bling.length){ //all bling
      systems[sys].planets[i].gravitate(systems[sys].bling[j]);//player bombs get pulled by all planets
      systems[sys].planets[i].circlecollide(systems[sys].bling[j]);//players bounce off planets
      j++;
    }
    var j=0;
    while (j<systems[sys].ships.length){ //all npc ships
      systems[sys].planets[i].gravitate(systems[sys].ships[j]);//player bombs get pulled by all planets
      systems[sys].planets[i].circlecollide(systems[sys].ships[j]);//players bounce off planets
      j++;
    }
    i++;
  }
//update stuff for nme ships;
  var i=0;
  while(i<systems[sys].ships.length){
    var j=i;//Prevents redundant checks with ship on ship stuff
    while(j<systems[sys].ships.length){//Intership collision
      systems[sys].ships[i].circlecollide2(systems[sys].ships[j]);
      systems[sys].botbombs[i].bombcollide(systems[sys].ships[j]);
      systems[sys].botbombs[j].bombcollide(systems[sys].ships[i]);
      j++;
    }
    var j=0; //
    var closestj = 0;
    var closestdistance = 10000;
    while (j<allusers.users.length){
      systems[sys].botbombs[i].bombcollide(allusers.users[j].s);
      allusers.users[j].bs.bombcollide(systems[sys].ships[i]);
      var nextdistance = allusers.users[j].s.distance(systems[sys].ships[i]);
      if (nextdistance<closestdistance){
        closestdistance = nextdistance;
        closestj = j;
        }  
      j++;
      }

    if (closestdistance<1200){
      systems[sys].ships[i].d = systems[sys].ships[i].directionof(allusers.users[closestj].s);
      if ((Math.random()>0.90) && (systems[sys].botbombs[i].timer < 1)){  //Bots fire occasionally, if bomb isn't in use
        systems[sys].ships[i].launchbomb(systems[sys].botbombs[i],8,64);					
        }
      }
    //systems[sys].ships[i].fasttrack(allusers.users[closestj].s);//track closest player
    systems[sys].ships[i].updateship(systems[sys].planets);
    systems[sys].botbombs[i].update1();
    systems[sys].botbombs[i].updatebomb();//This works because the lists are kept in sync
    var j=0;
    while(j<systems[sys].planets.length){
      systems[sys].planets[j].gravitate(systems[sys].botbombs[i]);//bombs get pulled by all planets
      systems[sys].planets[j].circlecollide(systems[sys].botbombs[i]);//bombs bounce off planets
      j++;
    }
    i++;
    }
 //Big allusers loop that does gravity, collisions, player actions, players and bomb updates starts here///////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var i=0;
  while (i<allusers.users.length){//Big allusers loop that does gravity, collisions, player actions, players and bomb updates
    var j=0;
    while (j<systems[sys].planets.length){//gravity and planet collisions
      systems[sys].planets[j].gravitate(allusers.users[i].s);//players get pulled by all planets
      systems[sys].planets[j].gravitate(allusers.users[i].bs);//player bombs get pulled by all planets
      systems[sys].planets[j].circlecollide(allusers.users[i].s);//players bounce off planets
      systems[sys].planets[j].circlecollide(allusers.users[i].bs);//player bombs bounce off planets
      j++;
    }
    var j=0;
    while (j<allusers.users.length){//Inter-player collisions
      if (i!=j){
        allusers.users[i].s.circlecollide2(allusers.users[j].s);//players bounce off each other
      }
      j++;
    }
    var j=0;
    while (j<systems[sys].ships.length){//Player-Enemy collisions
      allusers.users[i].s.circlecollide2(systems[sys].ships[j]);//players bounce off enemies
      j++;
    }
    var j=0;
    while(j<systems[sys].bling.length){
      if (allusers.users[i].s.collide(systems[sys].bling[j])){
        allusers.users[i].score++;
        systems[sys].bling.splice(j,1);
      }
      j++;
    }
    if (allusers.users[i].mousestate==1){//On click, launch bomb
      allusers.users[i].s.launchbomb(allusers.users[i].bs,12,128);//launchbomb(thebomb, mag, time){ 
      allusers.users[i].bs.push(2,allusers.users[i].s.d);//player thrusters
    }  
    if (allusers.users[i].mousestate==2){//on right click, thrust
      allusers.users[i].s.push(2,allusers.users[i].s.d);//player thrusters
    }
    //allusers.users[i].s.update1();//all players get updated
    allusers.users[i].s.updateship(systems[sys].planets);//all players get updated
    allusers.users[i].bs.update1();//all players get updated
    allusers.users[i].bs.updatebomb();//
    updateplayersarray.push([Math.floor(allusers.users[i].s.x),Math.floor(allusers.users[i].s.y),Math.floor(100*allusers.users[i].s.vx)/100,Math.floor(100*allusers.users[i].s.vy)/100,allusers.users[i].s.d,allusers.users[i].score,allusers.users[i].s.hp,allusers.users[i].s.shield]);
    updateplayerbombsarray.push([Math.floor(allusers.users[i].bs.x),Math.floor(allusers.users[i].bs.y),Math.floor(100*allusers.users[i].bs.vx)/100,Math.floor(100*allusers.users[i].bs.vy)/100,allusers.users[i].bs.s]);
    i++;
  }

if ((systems[sys].bling.length<512)&&(time%2==0)){
	systems[sys].bling.push(new Bling(0,0,0,0,Math.floor(Math.random()*128)));
	systems[sys].bling[systems[sys].bling.length-1].reset(systems[sys].planets);
	}
var i=0;
while(i<systems[sys].bling.length){
	if(systems[sys].bling[i].t>5000){systems[sys].bling[i].reset(systems[sys].planets);}
	i++;
}

//For now, bling array is NOT personalized, but filtered by all players proximities.
var i=0;
while(i<systems[sys].bling.length){
  systems[sys].bling[i].update1();
  var included = false;
  var j=0;
  while(j<allusers.users.length){
    if (allusers.users[j].s.distance(systems[sys].bling[i])<1500){
      included = true;
    }
    j++;
  }
  if (included){
    updateblingarray.push([Math.floor(systems[sys].bling[i].x),Math.floor(systems[sys].bling[i].y),Math.floor(100*systems[sys].bling[i].vx)/100,Math.floor(100*systems[sys].bling[i].vy)/100,systems[sys].bling[i].t]);
  }
  i++;
}


//For now, ships array is NOT personalized, but filtered by all players proximities.
var i=0;
while(i<systems[sys].ships.length){
  var included = false;
  var j=0;
  while(j<allusers.users.length){
    if (allusers.users[j].s.distance(systems[sys].ships[i])<3000){
      included = true;
    }
    j++;
  }
  if (included){
    updatenmeshipsarray.push([Math.floor(systems[sys].ships[i].x),Math.floor(systems[sys].ships[i].y),Math.floor(100*systems[sys].ships[i].vx)/100,Math.floor(100*systems[sys].ships[i].vy)/100,systems[sys].ships[i].d,systems[sys].ships[i].hp,systems[sys].ships[i].shield]);
  }
  i++;
}

//For now, ships array is NOT personalized, but filtered by all players proximities.
var i=0;
while(i<systems[sys].botbombs.length){
  var included = false;
  var j=0;
  while(j<allusers.users.length){
    if (allusers.users[j].s.distance(systems[sys].botbombs[i])<3000){
      included = true;
    }
    j++;
  }
  if (included){
    updatebotbombsarray.push([Math.floor(systems[sys].botbombs[i].x),Math.floor(systems[sys].botbombs[i].y),Math.floor(100*systems[sys].botbombs[i].vx)/100,Math.floor(100*systems[sys].botbombs[i].vy)/100,systems[sys].botbombs[i].s]);
  }
  i++;
}


console.log(updateblingarray.length+" "+systems[sys].bling.length);
io.emit('gameupdate', [updateplanetsarray,updateplayersarray,updateplayerbombsarray,updateblingarray,updatenmeshipsarray,updatebotbombsarray]);
  time++;
}