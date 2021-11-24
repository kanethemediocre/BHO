var Umo = require('./umo.js');
var Bling = require('./bling.js'); 
var System = require('./system.js');
var loadhomesystem = require('./homesystem.js');
var systems = [0,new System(1,"Sool",0,0)]//constructor(index, name, x, y){
systems[1].planets = loadhomesystem();
systems[1].addrandombling(16);
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
    this.bs = new Umo(-100,-100,8,"magenta");// this.s is player sprite, this.bs is bomb sprite
    //this.es = new Sprite(-100,-100,32,"orange");// this.es is the bomb explosion
    this.input = -1;
    this.mousestate = 0;
    this.score = 100;
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
server.listen(3000,'192.168.4.60');//server ip goes here
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
  //Planet update and array exporting/////////////////////////////////////////////////////////////////////
  updateplanetsarray.push([systems[sys].planets[0].x,systems[sys].planets[0].y,systems[sys].planets[0].vx,systems[sys].planets[0].vy]);//add sun to array
  var i=1;//for all not-sun planets
  while (i<systems[sys].planets.length){
    systems[sys].planets[0].gravitate(systems[sys].planets[i]);//sun pulls the planet
    if (systems[sys].planets[i].parentid!=0){//other planet pulls planet if the planet is a moon.
      systems[sys].planets[systems[sys].planets[i].parentid].gravitate(systems[sys].planets[i]);
    }
    systems[sys].planets[i].update1();//planet gets updated
    updateplanetsarray.push([systems[sys].planets[i].x,systems[sys].planets[i].y,systems[sys].planets[i].vx,systems[sys].planets[i].vy])
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
    if (allusers.users[i].mousestate==1){//On click, launch bomb
      allusers.users[i].s.launchbomb(allusers.users[i].bs,4,128);//launchbomb(thebomb, mag, time){ 
      allusers.users[i].bs.push(2,allusers.users[i].s.d);//player thrusters
    }  
    if (allusers.users[i].mousestate==2){//on right click, thrust
      allusers.users[i].s.push(2,allusers.users[i].s.d);//player thrusters
    }
    allusers.users[i].s.update1();//all players get updated
    allusers.users[i].bs.update1();//all players get updated
    //allusers.users[i].bs.updatebomb();//
    updateplayersarray.push([allusers.users[i].s.x,allusers.users[i].s.y,allusers.users[i].s.vx,allusers.users[i].s.vy,allusers.users[i].s.d]);
    updateplayerbombsarray.push([allusers.users[i].bs.x,allusers.users[i].bs.y,allusers.users[i].bs.vx,allusers.users[i].bs.vy,allusers.users[i].bs.s]);
    i++;
  }
//For now, bling array is NOT personalized, but filtered by all players proximities.
var i=0;
while(i<systems[sys].bling.length){
  systems[sys].bling[i].update1();
  updateblingarray.push([systems[sys].bling[i].x,systems[sys].bling[i].y,systems[sys].bling[i].vx,systems[sys].bling[i].vy,systems[sys].bling[i].t]);//not even filtered for now
  i++;
}

  io.emit('gameupdate', [updateplanetsarray,updateplayersarray,updateplayerbombsarray,updateblingarray]);
  time++;
}