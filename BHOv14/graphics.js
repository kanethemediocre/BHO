function rainbow(n){ //Returns a color of the rainbow corresponding to the integer n
    var color = "red";//default
    if (n==1){color = "orange";}
    if (n==2){color = "yellow";}
    if (n==3){color = "green";}
    if (n==4){color = "blue";}
    if (n==5){color = "purple";}
    return color;
}

function drawaskey(xpos,ypos,keystring,keycolor){//seems to cause graphical glitches after a few minutes runtime
    if (keystring==" "){
        context.fillStyle = keycolor;  
        context.fillText("Spacebar",xpos,ypos);
        context.beginPath();//added after obsoleting the function due to a bug.  Maybe fixes it?
        context.strokeStyle = keycolor; 
        context.lineWidth = 2;
        context.rect(xpos-8,ypos-16,128,24);
        context.stroke();				
    }else{			
        context.font='16px Courier New';
        context.fillStyle = keycolor;  
        context.fillText(keystring,xpos,ypos);
        context.beginPath();//added after obsoleting the function due to a bug.  Maybe fixes it?
        context.strokeStyle = keycolor; 
        context.lineWidth = 2;
        context.rect(xpos-8,ypos-16,24,24);
        context.stroke();
        }
    }
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
function draworthopoly(px,py, xlist, ylist, size, color, dir){//Not really useful, because this
    var fx = px + xlist[0]*size; //needs to be transformed to polar coords to rotate it anyways
    var fy = py + ylist[0]*size;
    context.fillStyle = color; //Now actual drawing of the things
    context.beginPath();
    context.moveTo(fx, fy); 
    i = xlist.length;
    while(i>0){
        i=i-1;
        var ix = px + xlist[i]*size;
        var iy = py + ylist[i]*size;
        context.lineTo(ix, iy);
    }
    context.fill();	
    }
function randpolarpoly(sides, minradius){//Polygons will be symmetrical, vertices evenly spaced
    spacing = 2*Math.PI/sides; //Needs at least 3.  Or 4, seems not to work right with odd numbers
    firstradius = Math.random()*(1-minradius) + minradius; //Minimum radius to make things less spiky
    vertices = [[0],[firstradius]];//Array of arrays, first element is list of angles, 2nd element is list of radii.
    i = 0;
    while (i<sides/2){ //First half is random
        i=i+1;
        vertices[0].push(spacing*i);
        vertices[1].push(Math.random()*(1-minradius) + minradius);
        }
    while (i<sides){ //2nd half matches first
        i=i+1;
        vertices[0].push(spacing*i);
        vertices[1].push(vertices[1][sides-i]);
        }
    return vertices; 
    }
function normalizepoly(vertices){//Make the largest radii equal to 1, scale the others proportionally.
    var maxr = 0;
    i = vertices[1].length;
    while (i>0){//finds the largest radii
        i=i-1;
        if (vertices[1][i]>maxr){maxr = vertices[1][i];}
        }
    i = vertices[1].length;
    while (i>0){//Scales radii to 1
        i=i-1;
        vertices[1][i]=vertices[1][i]/maxr;
        }
    }
function randcolor(){
    var thecolors = ["hotpink","deeppink","fuchsia","darkviolet","purple","indigo","salmon","crimson","red","darkred","orange","orangered","gold","yellow","khaki","lime","mediumspringgreen","seagreen","green","darkgreen","olive","teal","aqua","steelblue","lightskyblue","deepskyblue","blue","navy","tan","chocolate","sienna","maroon","silver","darkgrey","dimgrey"];
    return thecolors[Math.floor(Math.random()*thecolors.length)];
    }
function drawmap(mplanets, mstations,scale,xx,yy, px, py, radar, mships){//scale of -1 indicates autozoom?  xx,yy are screen coords
            var i = mplanets.length; //px, py are perspective x and y
            var x = 0;
            var y = 0;
            var size = 1;
            var xzoombox = canvas.width/scale;
            var yzoombox = canvas.height/scale
            context.beginPath(); //drawing yellowrectangle centered on x,y indicating zoom scale
            context.rect(xx-xzoombox/2,yy-yzoombox/2, xzoombox, yzoombox); //2*this.s wide
            context.lineWidth = 1; 
            context.strokeStyle = "yellow";
            context.stroke();	
            context.beginPath();//drawing red circle indicating radar range
            context.strokeStyle = "red"; 
            context.arc(xx, yy, radar/scale, 0, 2 * Math.PI, false); 
            context.lineWidth = 1; 
            context.stroke();	//ok now actually draw it.	
            
            while (i>0){
                i = i-1;
                x = xx + mplanets[i].x/scale - px/scale ;
                y = yy + mplanets[i].y/scale - py/scale;
                size = 1+ Math.floor(mplanets[i].s/scale);
                context.beginPath();
                context.strokeStyle = mplanets[i].c; //drawing planet
                context.arc(x, y, size, 0, 2 * Math.PI, false); 
                context.lineWidth = 1; 
                context.stroke();	//ok now actually draw it.	
                if (mplanets[i].parentid == 0){//If planet
                    oradius = mplanets[0].distance(mplanets[i])/scale;
                    context.beginPath();
                    context.strokeStyle = "darkslategrey"; //drawing faint orbit radius
                    context.arc(xx-px/scale, yy-py/scale, oradius, 0, 2 * Math.PI, false); 
                    context.lineWidth = 1; 
                    context.stroke();	//ok now actually draw it.	
                    }
                }
            var i = mstations.length; //px, py are perspective x and y
            var x = 0;
            var y = 0;
            var size = 1;
            while (i>0){
                i = i-1;
                x = xx + mstations[i].x/scale - px/scale ;
                y = yy + mstations[i].y/scale - py/scale;
                size = 1+ Math.floor(mstations[i].s/scale);
                context.fillStyle = mstations[i].c; 
                context.fillRect(x, y, 4, 4); 
                context.fill();
                }
            var i = mships.length; //px, py are perspective x and y
            var x = 0;
            var y = 0;
            var size = 1;
            while (i>0){
                i = i-1;
                if (mships[i].distance(mships[0])<radar){
                    x = xx + mships[i].x/scale - px/scale ;
                    y = yy + mships[i].y/scale - py/scale;
                    size = 1+ Math.floor(mships[i].s/scale);
                    //context.fillStyle = mships[i].c; 
                    if (mships[i].ai == "enemy"){context.fillStyle = "red";} 
                    else if (mships[i].ai == "trader"){context.fillStyle = "blue";} 
                    else {context.fillStyle = "white";} 
                    context.fillRect(x, y, 3, 3); 
                    context.fill();
                    }
                }
            
            }
//drawmap(planets,1000,canvas.width/2,200);//scale of -1 indicates autozoom?  xx,yy are screen coords