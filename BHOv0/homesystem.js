var Umo = require('./umo.js');
module.exports = function loadhomesystem(){
	let sun = new Umo(0, 0, 2048, "orange"); //planet initialization/////////////
	sun.name = "Sool";
	let murc = new Umo(0,8000,150,"brown");//1//initial position irrelevant
	murc.name = "Murc";
	murc.setorbit(sun, 8000, 0, 1);
	murc.parentid = 0;
	murc.c2 = "darkred";
	console.log(murc.vx+", "+murc.vy)
	let vnus = new Umo(0,14000,280,"yellow");//2
	vnus.name = "Vnus";
	vnus.setorbit(sun, 14000, 0, 1);
	vnus.parentid = 0;
	vnus.c2 = "tan";	
	let earf = new Umo(0, 20000, 320, "blue"); //3
	earf.setorbit(sun, 20000, 0, 1);
	earf.name = "Earf";
	earf.parentid = 0;
	earf.c2 = "green";
	let moon = new Umo(1000, 20000, 100, "white"); //4
	moon.name = "Moon";
	moon.setorbit(earf, 1000, 0, 1);
	moon.parentid = 3;
	moon.c2 = "grey";
	let merz = new Umo(0, 32000, 220, "brown");//5
	merz.name = "Merz";						
	merz.setorbit(sun, 32000, 0, 1);
	merz.parentid = 0;
	merz.c2 = "red";
	let fobz = new Umo(600,32000,32, "grey");//6
	fobz.name = "Fobz";
	fobz.setorbit(merz, 600, 0, 1);
	fobz.parentid = 5;
	fobz.c2 = "darkgrey";
	let deem = new Umo(-800,32000,32, "white");//7
	deem.name = "Deem";
	deem.setorbit(merz, 800, 0, 1);
	deem.parentid = 5;
	deem.c2 = "grey";
	let jupe = new Umo(0,0,1024,"brown");//8
	jupe.name = "Jupe";
	jupe.setorbit(sun,80000,0,1);
	jupe.parentid = 0;
	jupe.c2 = "purple";
	let heyo = new Umo(0,0,120,"yellow");//9
	heyo.name = "Heyo";
	heyo.setorbit(jupe,1280,0,1);
	heyo.parentid = 8;
	heyo.c2 = "beige";
	let erpa = new Umo(0,0,200,"blue");//10
	erpa.name = "Erpa";
	erpa.setorbit(jupe,3600,0,1);
	erpa.parentid = 8;
	erpa.c2 = "teal";
	let mede = new Umo(0,0,280,"brown");//11
	mede.name = "Mede";
	mede.setorbit(jupe,5200,0,1);
	mede.parentid = 8;
	mede.c2 = "firebrick"
	let isto = new Umo(0,0,280,"tan");//12
	isto.name = "Isto";
	isto.setorbit(jupe,7200,0,1);
	isto.parentid = 8;
	isto.c2 = "goldenrod"
	let tern = new Umo(0,0,750,"yellow");//13
	tern.name = "Tern";
	tern.setorbit(sun,130000,0,1);
	tern.parentid = 0;
	tern.c2 = "lightyellow";
	let thys  = new Umo(0,0,120,"grey");//14
	thys.name = "Thys";
	thys.setorbit(tern,1200,0,1);
	thys.parentid = 13;
	thys.c2 = "azure";
	let dion  = new Umo(0,0,150,"grey");//15
	dion.name = "Dion";
	dion.setorbit(tern,1800,0,1);
	dion.parentid = 13;
	dion.c2 = "cadetblue";
	let raya  = new Umo(0,0,200,"darkslategrey");//16
	raya.name = "Raya";
	raya.setorbit(tern,2400,0,1);
	raya.parentid = 13;
	raya.c2 = "dimgrey";
	let itan  = new Umo(0,0,300,"grey");//17
	itan.name = "Itan";
	itan.setorbit(tern,3600,0,1);
	itan.parentid = 13;
	itan.c2 = "lightgrey";
	let peet  = new Umo(0,0,200,"grey");//18
	peet.name = "Peet";
	peet.setorbit(tern,5600,0,1);
	peet.parentid = 13;
	peet.c2 = "aliceblue";
	let anus = new Umo(0,0,500,"green");//19
	anus.name = "Anus";
	anus.setorbit(sun,170000,0,1);
	anus.parentid = 0;
	anus.c2 = "aquamarine";
	let aril  = new Umo(0,0,150,"grey");//20
	aril.name = "Aril";
	aril.setorbit(anus,1000,0,1);
	aril.parentid = 19;		
	aril.c2 = "cyan";
	let umbi  = new Umo(0,0,150,"grey");//21
	umbi.name = "Umbi";
	umbi.setorbit(anus,1500,0,1);
	umbi.parentid = 19;	
	umbi.c2 = "darkcyan";
	let titi  = new Umo(0,0,200,"tan");//22
	titi.name = "Titi";
	titi.setorbit(anus,2400,0,1);
	titi.parentid = 19;	
	titi.c2 = "olive"
	let bron  = new Umo(0,0,200,"maroon");//23
	bron.name = "Bron";
	bron.setorbit(anus,3000,0,1);
	bron.parentid = 19;		
	bron.c2 = "brown";
	let tune = new Umo(0,0,550,"cyan");//24
	tune.name = "Tune";
	tune.setorbit(sun,210000,0,1);
	tune.parentid = 0;
	tune.c2 = "white";
	let tron = new Umo(0,0,250,"navy");//25
	tron.name = "Tron";
	tron.setorbit(tune,1500,0,1);
	tron.parentid = 24;
	tron.c2 = "lightslategrey";
//	let xxxx = new Umo(0,0,550,"black");//26
	//xxxx.name = "Xxxx";
	//xxxx.setorbit(sun,320000,0,-1);
	//xxxx.parentid = 0;
	
	
	let homeplanets = [sun,murc,vnus,earf,moon,merz,fobz,deem,jupe,heyo,erpa,mede,isto,tern,thys,dion,raya,itan,peet,anus,aril,umbi,titi,bron,tune,tron];
	return homeplanets;
	}