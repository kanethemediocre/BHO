function drawpolarpoly(px,py,thetalist, radiuslist, size, color, dir){
    //requires, does not verify, that thetalist.length==radiuslist.length, thetalist.length>2, color be valid
        var fx = px + Math.cos(dir+thetalist[0])*size*radiuslist[0];
        var fy = py + Math.sin(dir+thetalist[0])*size*radiuslist[0];
        context.fillStyle = color; //Now actual drawing of the things
        context.beginPath();
        context.moveTo(fx, fy); 
        i = thetalist.length;
        while(i>0){
            i=i-1;
            var ix = px + Math.cos(dir+thetalist[i])*size*radiuslist[i];
            var iy = py + Math.sin(dir+thetalist[i])*size*radiuslist[i];
            context.lineTo(ix, iy);
        }
        context.fill();	
    }




class Umo { //Universal Moving Object (taken from umo space git)
	constructor(xxx, yyy, sss, ccc) {
		this.name = "Cactus Fantastico";
		this.type = "unspecified"; //I might use this to identify different
		this.x = xxx; //x
		this.y = yyy; //y
		this.c = ccc; //color
		this.c2 = 0; //Not a color, used to exclude 2-tone functions on single color umos.
		this.s = sss; //size
		this.d = 0; // direction
		this.vx = 0; //start with 0 velocity 
		this.vy = 0;
		this.vd = 0; //0 rotation 
		this.m = this.s*this.s*this.s; //So far only used by gravitate function.
		this.hp = 100 ; //This is used for destructible entities to track health
		this.maxhp = 100;
		this.shield = 50; //for ships, mostly
		this.maxshield = 50; 
		this.shieldregen = 1;
		this.polyradius = [1,1,1]; //Default values are the triangle originally
		this.polytheta = [0,0.8*Math.PI,1.2*Math.PI];	//used for ship drawing
		this.level = 1; //Describes difficulty of a given ship
		this.parentid = 0;
		this.active = true; //Flag indicating if ship (or planet's ships) needs to be considered by the game engine 
		this.shopchart = [];//["Item Name","Item type",price,tier]
		this.target = 0; //For ai use
		this.ai = "none";
		this.aistate = "none";
		this.aitargets = [];
		this.damagestate = 0;
		this.shielddamagestate = 0;
		}
	update1(){ //Pure motion update.
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;
		this.d = this.d + this.vd;
		}
	distance(relation){
		var dx = this.x - relation.x; 
		var dy = this.y - relation.y;
		return Math.sqrt(((dx)*(dx) + (dy)*(dy)));	
	}
	deltav(relation){ //returns magnitude only
		var dvx = this.vx - relation.vx; 
		var dvy = this.vy - relation.vy;
		return Math.sqrt(((dvx)*(dvx) + (dvy)*(dvy)));			
		}
	deltav2(relation){//returns magnitude, direction (polar vector)
		var dvx = this.vx - relation.vx; 
		var dvy = this.vy - relation.vy;
		var mag = Math.sqrt(((dvx)*(dvx) + (dvy)*(dvy)));	
		var dir =  -1*Math.atan2(dvx,dvy) - Math.PI/2;
		return [mag,dir];
		}

	collide(that){ //circular collision function
		if (this.distance(that) < (this.s + that.s)) {return true; }else{return false;} 
		} //Doesn't bounce or damage, just returns 1 if a collision is occuring.
	directionof(destination){
		var dx = this.x - destination.x; 
		var dy = this.y - destination.y;
		var	dirof = 0;	
		dirof = -1*Math.atan2(dx,dy) - Math.PI/2;//Sort of trial and error for this
		return dirof;	
		}
	drawship(viewx, viewy){ //Ships are drawn as polar polygons, a triangle is the default.  Viewx/viewy are camera center
		var x = this.x - viewx + canvas.width/2; //normally camera center being the player ship.
		var y = this.y - viewy + canvas.height/2;
		var color1 = this.c;
		var color2 = this.c2;
		var shieldcolor = "blue";
		if (this.damagestate>0){
			color1 = randcolor();
			color2 = randcolor();
			}
		if (this.shielddamagestate>0){shieldcolor = randcolor(); }
		drawpolarpoly(x,y,this.polytheta, this.polyradius, this.s, color1, this.d);//ship polyon
		drawpolarpoly(x,y,this.polytheta, this.polyradius, this.s-8, color2, this.d);//ship polyon
		var shieldthick = Math.floor(this.shield*4/this.maxshield); //shield
		if (shieldthick>0){ //Needs to not render at all sometimes because linewidth of 0 is ignored instead of invisible.
			context.beginPath();  //So instead of not rendering, it will render at most recent thickness (often max)
			context.arc(x, y, this.s+2, 0, 2 * Math.PI, false); //until linewidth of 1 is reached.
			context.lineWidth = shieldthick;
			context.strokeStyle = shieldcolor;
			context.stroke();	
		}//Now a health bar/////////////////////////////////////////
		var prop = this.hp / this.maxhp;
		var hpc = "green"; //health bar color depends on healthiness
		if (prop < 0.66){ hpc = "yellow"; }
		if (prop < 0.33){ hpc = "red"; }
		context.fillStyle = hpc; //health bar color depends on ship condition
		context.fillRect(x-this.s/2, y+this.s, Math.floor(this.s*prop), 4);
		}
	drawplanet(viewx, viewy){ //input variables are player ship/camera position
		var x = this.x - viewx + canvas.width/2; //this function draws object as a circle,
		var y = this.y - viewy + canvas.height/2; //and labels it
		context.beginPath();
		context.strokeStyle = this.c; //sets planet color
		context.arc(x, y, this.s, 0, 2 * Math.PI, false); //draws the circle
		context.lineWidth = 16; //circle is thicc
		context.stroke();	//ok now actually draw it.
		if ((this.c2!==0)&&(this.s>16)){
			context.beginPath();
			context.strokeStyle = this.c2; //sets planet color
			context.arc(x, y, this.s-8, 0, 2 * Math.PI, false); //draws the 2nd outermost circle
			context.lineWidth = 8; //circle is thicc
			context.stroke();	//ok now actually draw it.
			context.beginPath();
			context.fillStyle = this.c; //sets planet color
			context.arc(x, y, this.s-12, 0, 2 * Math.PI, false); //draws the innermost circle
			context.lineWidth = 8; //circle is thicc
			context.fill();	//ok now actually FILL it.

			context.beginPath();
			context.fillStyle = this.c2; //sets color of secondary blobs
			var i=0;
			while(i<this.polytheta.length){
				context.beginPath();
				var blobsize = this.s*0.5*this.polyradius[i]
				var blobdistance = this.s - blobsize-4;
				var blobx = x+Math.cos(this.polytheta[i])*blobdistance;
				var bloby = y+Math.sin(this.polytheta[i])*blobdistance;
				context.arc(blobx, bloby, blobsize, 0, 2 * Math.PI, false); //draws the innermost circle
				context.lineWidth = 8; //circle is thicc
				context.fill();	//ok now actually FILL it.
				i=i+1;
				}
			}
		context.fillStyle = "white"; 
		context.font='20px Arial';
		context.fillText(this.name,x,y);		
	}
	drawbomb(viewx, viewy){ //Bombs are also drawn as circles, but not labelled.
		var x = this.x - viewx + canvas.width/2;
		var y = this.y - viewy + canvas.height/2;
		context.beginPath();
		context.strokeStyle = this.c;
		context.arc(x, y, this.s, 0, 2 * Math.PI, false);
		context.lineWidth = 4;
		context.stroke();		 
	}
	drawdot(viewx, viewy){ //Draws as a solid circle
		var x = this.x - viewx + canvas.width/2;
		var y = this.y - viewy + canvas.height/2;
		context.beginPath();
		context.strokeStyle = this.c;
		context.arc(x, y, this.s, 0, 2 * Math.PI, false);
		context.fillStyle = this.c;
		context.fill();
		context.lineWidth = 2;
		context.stroke();		 
	}
	drawstation(viewx, viewy){ //input variables are player ship position
		var x = this.x - viewx + canvas.width/2;//stations are squares for now
		var y = this.y - viewy + canvas.height/2;
		drawpolarpoly(x,y,this.polytheta, this.polyradius, this.s, this.c, this.d);//ship polyon
		drawpolarpoly(x,y,this.polytheta, this.polyradius, this.s-16, this.c2, this.d);//ship polyon but smaller, makes first one the outline
		drawpolarpoly(x,y,this.emblem[0],this.emblem[1],this.s/2,this.c,this.d); //this.emblem is a randomized logo
		context.fillStyle = "white";
		context.font='20px Arial';
		context.fillText(this.name,x,y);	
	}

	drawreticle(viewx, viewy){ //input variables are player ship / camera position
		var x = this.x - viewx + canvas.width/2; //draws reticle around object
		var y = this.y - viewy + canvas.height/2; //circular reticle.
		context.beginPath();
		context.arc(x, y, this.s+24, 0, 2 * Math.PI, false);
		context.lineWidth = 2;
		context.strokeStyle = "white";
		context.stroke();	
	}
	drawcompass(targetship, compassx, compassy, compasssize){  //Draws a triangle pointing in direction of targetship
		var de = targetship.directionof(this); //targetship doesn't actually have to be a ship
		var tipx = Math.cos(de)*compasssize + compassx; //triangle points
		var tipy = Math.sin(de)*compasssize + compassy; //sort of from polar coordinates
		var taillx = Math.cos(de + 0.9*Math.PI)*compasssize + compassx;
		var tailly = Math.sin(de + 0.9*Math.PI)*compasssize + compassy;
		var tailrx = Math.cos(de + 1.1*Math.PI)*compasssize + compassx;
		var tailry = Math.sin(de + 1.1*Math.PI)*compasssize + compassy;
		context.fillStyle = this.c; //Now actual drawing of the things
		context.beginPath(); 
		context.moveTo(tipx, tipy); //Could be consolidated for less lines with above.
		context.lineTo(taillx, tailly);
		context.lineTo(tailrx, tailry);
		context.lineTo(tipx, tipy);
		context.fill();
		context.font='12px Arial';
		context.fillStyle = "white";
		//context.fillText(this.name,compassx-8,compassy - 48);
		context.fillText(this.name,compassx-8,compassy - compasssize);
		context.fillStyle = "white";
		//context.fillText(this.hp,compassx-8,compassy - 32);
		context.fillStyle = "white";
		context.fillText(Math.floor(this.distance(targetship)),compassx-16,compassy + compasssize);
		}// end compass stuff
		
	drawcompass2(targetship, compassx, compassy, compasssize){  //Draws a triangle pointing in direction of targetship
		var de = this.directionof(targetship); //targetship doesn't actually have to be a ship
		var tl = [0,0.05,0.4,-0.4,-0.05];
		var rl = [1,0.85,0.8,0.8,0.85];
		drawpolarpoly(compassx,compassy,tl, rl, compasssize, "yellow", de);//function drawpolarpoly(px,py,thetalist, radiuslist, size, color, dir){
		drawpolarpoly(compassx,compassy,targetship.polytheta, targetship.polyradius, compasssize*0.5, targetship.c, targetship.d);//function drawpolarpoly(px,py,thetalist, radiuslist, size, color, dir){
		drawpolarpoly(compassx,compassy,targetship.polytheta, targetship.polyradius, compasssize*0.5-8, targetship.c2, targetship.d);//function drawpolarpoly(px,py,thetalist, radiuslist, size, color, dir){
		context.font='12px Arial';
		context.fillStyle = "white";
		//context.fillText(this.name,compassx-8,compassy - 48);
		context.fillText(targetship.name,compassx-8,compassy - compasssize);
		context.fillStyle = "white";
		//context.fillText(this.hp,compassx-8,compassy - 32);
		context.fillStyle = "white";
		context.fillText(Math.floor(this.distance(targetship)),compassx-16,compassy + compasssize);
		}// end compass stuff
	setorbit(parentplanet, distance, direction, cw){ //cw = -1 or 1
		this.match(parentplanet); //set velocity and position equal
		this.x = this.x + (distance)*Math.cos(direction); //set relative
		this.y = this.y + (distance)*Math.sin(direction); //start location;
		var gravy = parentplanet.m*.0003 / (distance*distance);  //gMm/r^2, where m is 1;
		var orbitspeed = Math.sqrt(gravy*distance);  //a = v^2/r, a* r = v^2, v = sqrt(a*r)
		this.vx = this.vx + orbitspeed*Math.cos(direction + cw*Math.PI/2);
		this.vy = this.vy + orbitspeed*Math.sin(direction + cw*Math.PI/2);
		}

	ispointingat(thetarget){
		var dx = thetarget.s;
		var dy = this.distance(thetarget);
		var dtheta = Math.atan(dx/dy);
		var dd = this.d-this.directionof(thetarget);
		if (dd> Math.PI){dd=dd-2*Math.PI;}
		var answer = false;
		if (dtheta*dtheta > dd*dd){
			answer = true;
			}
		return answer; //wrong for testing
		}
	drawbeam(viewx, viewy, beamlength, beamwidth, beamcolor){  //Draws the lazor
		var x = this.x - viewx + canvas.width/2; //normally camera center being the player ship.
		var y = this.y - viewy + canvas.height/2;
		var beamstartx = x + (this.s+4)*Math.cos(this.d);
		var beamstarty = y + (this.s+4)*Math.sin(this.d); 
		var beamstopx = x + (this.s+4+beamlength)*Math.cos(this.d);
		var beamstopy = y + (this.s+4+beamlength)*Math.sin(this.d); 
		context.strokeStyle = beamcolor; //Now actual drawing of the things
		context.lineWidth = beamwidth;
		context.beginPath(); 
		context.moveTo(beamstartx, beamstarty); 
		context.lineTo(beamstopx, beamstopy);
		context.stroke();
	}
	makeemblem(numsides,minimumradius){
		this.emblem = randpolarpoly(numsides,minimumradius);			//function randpolarpoly(sides, minradius){//Polygons will be symmetrical, vertices evenly spaced
	}
}
