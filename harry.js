// harry plotter 0.8
// ~L~ nikomomo@gmail.com 2009-2012
// https://github.com/nikopol/Harry-Plotter

/*

//everything in the constructor is optional
//if data are provided, the graph is directly drawn

var h=harry({

	//datas can be provided in these formats :
	
	datas: [v1,v2,v3,...],        //simple dataset values
	datas: [v1,v2,v3,...],        //simple dataset values
	datas: [[v1,v2],[w1,w2],...], //multiple dataset values
	datas: {                      //simple dataset with optionaly labels, color and title
		values: [v1,v2,...],      //  excepting values, all keys are
		labels: [l1,l2,...],      //  optionals in this format
		title: "my dataset #1",   //  values can also be an hash {label:value,...}
		color: "#fc0"
	},
	datas: [                      //multiple dataset with label,color and title
		{ values:[...],labels:[...],title:"...",color:"..." },
		{ values:[...],labels:[...],title:"...",color:"..." }
	],

	//context

	id: "str",                    //canvas's id, by default harry$n
	container: "str/elem",	      //container where create canvas, default=body
	canvas: "str/elem",           //canvas element, default=create it into container
	width: int,                   //canvas's width, default=container.width or 300
	height: int,                  //canvas's height, default=container.height or 80
	
	//rendering

	background: "rgba(0,0,0,0.5)" //background color, default=transparent
	mode: "curve:river",          //draw mode, can be:
	                              //  pie          cheesecake
	                              //  chart        histogram, side by side
	                              //  chart:stack  stacked histograms
	                              //  line         lines (default)
	                              //  line:river   stacked lines
	                              //  curve        curved lines
	                              //  curve:river  stacked curved lines
	linewidth: int,               //line width, default=1
	linejoin: "round",            //line join, can be round|bevel|miter default=miter
	fill: "vertical",             //fill style (only first letter matter), can be:
	                              //  none         without fills
	                              //  auto         fill or not depending mode (default)
	                              //  solid        uniform fill
	                              //  light        lighten color
	                              //  dark         darken color
	                              //  vertical     vertical gradient fill
	                              //  horizontal   horizontal gradient fill
	                              //  radial       radial gradient fill
	opacity: 0.8,                 //fill opacity, between 0 and 1, overrided if fill=auto
	margins:[top,right,bot,left], //margin size (for labels), default=auto
	autoscale: "top+bottom",      //auto round top and/or bottom y scale, default=none
	pointradius: int,             //radius point size in mode line/curve only, default=none

	title: {                      //title options
		text: "title",            //  clear enough
		font:'9px "Trebuchet MS"',//  font size & family, default=bold 12px "Sans Serif"
		color: "rgba(4,4,4,0.3)", //  font color, default=rgba(4,4,4,0.3)
		shadow: "x,y,blur,#col",  //  text shadow, default=none
		x: 5,                     //  title position left position
		y: 10,                    //  title position top position
		z: "background"           //  behind or on top of the graph, default=top
	},

	labels: {                     //axis labels options
		font: "9px Trebuchet MS", //  font size & family, important:use px size,
		                          //    default=normal 9px "Sans Serif"
		color: "#a0a0a0",         //  font color, default=a0a0a0
		shadow: "x,y,blur,#col",  //  label text shadow, default=none
		y: [0,50,100],            //  y axis, numbers are %, default=none
		ypos: "left+right",       //  y labels position, default=right
		x: int,                   //  x axis, 1=draw all label, 2=one/two..., default=none
		marks: int                //  graduation's marks size, default=0
	},

	legends: {                    //set to false to disable legends box, default=auto
		x: int,                   //  left corner position, default=5
		y: int,                   //  top corner position,  default=5
		background: "rgba(180,180,180,0.5)",//background color, default=rgba(255,255,255,0.5)
		border: "#fff",           //  legends border color, default=none
		shadowbox: "x,y,b,#col",  //  legends box shadow, default=none
		border2: "#fff",          //  color box border color, default=none
		color: "#000",            //  text color, default, #666
		shadow: "x,y,blur,#col",  //  legends text shadow, default=none
		font:'9px "Trebuchet MS"' //  font size & family, default=normal 10px "Sans Serif"
	},

	grid: {                       //grid options
		color:"#a0a0a0",          //  grid color, default=#a0a0a0
		y: [0,50,100],            //  y axis, numbers are %, default=[0,25,50,75,100]
		x: [0,100]                //  x axis, numbers are %, default=[0,100]
	},

	//interaction

	mouseover: {,                 //set to false to disable mouseover, default=enabled
		bullet: "rgba(0,0,0,0.5)",//  bullet background color, default=rgba(99,99,99,0.8)
		border: "#fc0",           //  bullet border color, default=none,
		shadowbox: "x,y,b,#col",  //  bullet box shadow, default=none
		font: "9px Trebuchet MS", //  bullet text font, default=normal 9px "Sans Serif"
		color: "#666",            //  bullet text color, default=#fff
		shadow: "x,y,blur,#col",  //  bullet text shadow, default=none
		radius: int,              //  spot radius, default=5
		linewidth: int,           //  spot linewidth, default=linewidth below,0=fill
		circle: "#888888",        //  spot color, default=#888
		border2: "#fff",          //  spot color, default=none
		axis: "xy|x|y",           //  draw spot axis, default=none
		text: "%t\n%l: %v",       //  text in the bullet %v=value %l=label %n=index %t=title
		text: callback(n,v,l,x,y) //  or text can trigger a callback
		                          //     if it returns a string, it'll be displayed
	}
});

//or (same effect)
var h=plotter({...});


h.clear()             //delete all dataset
 .load(data)          //add a dataset, see contructor
 .draw();             //draw all dataset
h.canvas.onclick=function(){
	 h.draw('river'); //redraw
};

*/

var
harry=(function(o){
	"use strict";
	var

//CONSTS ======================================================================

	COLORS=["#88a4d7","#d685c9","#86d685","#ffc34f","#93c2ea","#f28989","#f9eb8a"],

//TOOLS LIB ===================================================================

	getRGB=function(color){
		var result;
		if(color && color.constructor==Array && color.length==3) return color;
		if(result=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) return [parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)];
		if(result=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color)) return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];
		if(result=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)) return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];
		if(result=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color)) return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];
		return [0,0,0];
	},

	calcColor=function(color,delta,alpha){
		var rgb=getRGB(color);
		if(typeof delta!="array") delta=[delta,delta,delta];
		for(var i=0;i<3;++i) rgb[i]=Math.max(Math.min(rgb[i]+delta[i],255),0);
		return (alpha!=undefined)?
			"rgba("+rgb.join(',')+","+alpha+")":
			"rgb("+rgb.join(',')+")";
	},

	fontPixSize=function(f){
		var p=f.match(/\d+px/i);
		if(p) return parseInt(p,10);
		p=f.match(/[0-9\.]+em/i);
		if(p) return Math.floor(16.0*parseFloat(p));
		p=f.match(/\d+pt/i);
		if(p) return Math.floor(1.3333*parseInt(p,10));
		return 10;
	},

	calcMargins=function(mode,l,mo){
		var m=fontPixSize(l.font);
		if(/pie/.test(mode)) {
			m=l.x ? m*2 : (mo===false ? 0 : 15);
			return [m,m,m,m];
		}
		var
		f=Math.floor(m/2),
		k=labels.marks;
		return [
		/*top*/    l.y ? f : 0,
		/*right*/  l.y && /r/i.test(l.ypos) ? m*4 : (l.x?m:1),
		/*bottom*/ l.x ? 3+m+k : (l.y?m:1),
		/*left*/   l.y && /l/i.test(l.ypos) ? m*4 : (l.x?f:0)
		];
	},

	scaleUp=function(n){
		var s=Math.floor(n).toString(),
		    d=parseInt(s.substr(0,1),10),
		    m=d*parseFloat("1E"+(s.length-1));
		return m==n ? n : (d+1)*parseFloat("1E"+(s.length-1));
	},

	merge=function(a,b){
		if(typeof(b)=='object')
			for(var k in b)
				a[k]=b[k];
		return a;
	},

	mouseXY=function(e){
		e=e||window.event;
		if('offsetX' in e) return {x:e.offsetX,y:e.offsetY};
		var o=e.target,p={x:e.pageX,y:e.pageY};
		while(o.offsetParent){
			p.x-=o.offsetLeft;
			p.y-=o.offsetTop;
			o=o.offsetParent;
		}
		return p;
	},

	buildCanvas=function(o,w,h){
		var c=document.createElement('canvas'),p;
		c.setAttribute('width',w+'px');
		c.setAttribute('height',h+'px');
		if(o) p=typeof(o)=='string'?document.getElementById(o):o;
		if(!p) p=document.body;
		p.appendChild(c);
		return c;
	},

//PRIVATE VARS ================================================================

	canvas=o.canvas
		? document.getElementById(o.canvas)
		: buildCanvas(o.container,o.width||300,o.height||150),
	w=canvas.width,
	h=canvas.height,
	gc=canvas.getContext("2d"),
	imgdata,
	bg=o.background,
	mode=o.mode||'line',
	fill=(o.fill||"a")[0].toLowerCase().replace(/[^nasvhrdl]+/g,"a"),
	opacity=parseFloat(o.opacity)||1,
	linewidth=parseInt(o.linewidth,10)||1,
	linejoin=o.linejoin||"miter",
	radiuspoint=parseInt(o.radiuspoint,10)||0,
	scaletop=o.autoscale && /top/i.test(o.autoscale),
	scalebot=o.autoscale && /bot/i.test(o.autoscale),
	labels=merge({
		color: "#a0a0a0",
		font: 'normal 9px "Sans Serif"',
		marks: 0,
		ypos: 'right'
	},o.labels),
	mouseover=o.mouseover===false
		? false
		: merge({
			radius: 5,
			linewidth: linewidth,
			circle: "#888",
			font: 'normal 10px "Sans Serif"',
			color: "#fff",
			bullet: "rgba(99,99,99,0.8)",
			axis: false,
			text: "%v"
		},o.mouseover),
	mousepos,
	overpoints=[],
	overpie={n:false},
	automargins=o.margins ? false : true,
	margins=automargins ? calcMargins(mode,labels,mouseover) : o.margins,
	grid=merge({
		color: "#a0a0a0",
		x: [0,100],
		y: [0,25,50,75,100]
	},o.grid),
	title=o.title
		? merge({
			font: 'bold 12px "Sans Serif"',
			color: 'rgba(4,4,4,0.3)',
			x: margins[3]+2.5,
			y: margins[0]+2.5,
			z: 'top'
		},	o.title)
		: false,
	legends=o.legends===false
		? false
		: merge({
			x: margins[3]+2.5,
			y: margins[0]+2.5+(o.title && !o.title.x ? 2+fontPixSize(title.font) : 0),
			color: "#666",
			font: '10px "Sans Serif"'
		},o.legends),
	river,
	data=[], dmin, dmax, dlen=0, dsum, drng, dinc,
	rx, ry, rw, rh, rx2, ry2,

//PRIVATE METHODS =============================================================

	draw,

	//setup precalc vars
	setup=function(){
		var i,j,l,d,s;
		dlen=data.length;
		river=/\:[rs]/.test(mode),
		dmin=dmax=false;
		drng=dsum=dinc=0;
		if(dlen) {
			for(i=0;i<dlen;i++) {
				d=data[i];
				dmin=dmin===false?d.min:Math.min(d.min,dmin);
				dmax=dmax===false?d.max:Math.max(d.max,dmax);
			}
			if(scaletop) dmax=scaleUp(dmax);
			if(river) {
				for(i=0,l=data[0].len;i<l;++i){
					s=0;
					for(j=0;j<dlen;++j) s+=(data[j].val[i]||0);
					if(s>dsum) dsum=scaletop ? scaleUp(s) : s;
				}
				drng=scalebot ? dsum-dmin : dsum;
			} else {
				dsum=dmax;
				drng=scalebot ? dmax-dmin : dmax;
			}
			dinc=scalebot ? dmin : 0;
		}
	},

	//load a dataset
	load=function(d) { 
		var t,v,k,vals=d.values||d,labs=d.labels||[],
		ds={
			val:[], lab:[], len:0, sum:0, avg:0, max:0, min:0xffffffffffff,
			tit:d.title || "dataset#"+(data.length+1),
			col:d.color || COLORS[data.length%COLORS.length]
		};
		for(k in vals) {
			v=parseFloat(vals[k]);
			ds.val.push(vals[k]==null?null:v);
			ds.lab.push(labs[k]||k);
			ds.sum+=v;
			if(v>ds.max) ds.max=v;
			if(v<ds.min) ds.min=v;
		}
		ds.len=ds.val.length;
		ds.avg=ds.len ? ds.sum/ds.len : 0;
		data.push(ds);
	},

	//load datasets
	loads=function(datas) {
		if(datas instanceof Array && typeof(datas[0])=='object')
			for(var i=0,l=datas.length;i<l;++i)
				load(datas[i]);
		else
			load(datas);
		setup();
	},

	//return auto fillmode
	getFillMode=function() {
		if(fill=="a") {
			opacity=1;
			if(/\:river/.test(mode))  return "v";
			if(/line/.test(mode))     return dlen>1?"n":"v";
			if(/curve/.test(mode))    return dlen>1?"n":"v";
			if(/chart/.test(mode))    return dlen>1?"s":"v";
			if(/pie/.test(mode.test)) return "r";
			return "s";
		}
		return fill;
	},
	
	//set and return a fillstyle
	setGradient=function(color){
		var g;
		switch(getFillMode()) {
		case "s": //solid
			g=calcColor(color,0,opacity);
			break;
		case "l": //light
			g=calcColor(color,0x15,opacity);
			break;
		case "d": //dark
			g=calcColor(color,-0x15,opacity);
			break;
		case "v": //vertical
			g=gc.createLinearGradient(0,ry2,0,ry);
			g.addColorStop(0,calcColor(color,-0x30,opacity));
			g.addColorStop(1,calcColor(color,0x30,opacity));
			break;
		case "h": //horizontal
			g=gc.createLinearGradient(rx,0,rx2,0);
			g.addColorStop(0,calcColor(color,-0x30,opacity));
			g.addColorStop(1,calcColor(color,0x30,opacity));
			break;
		case "r": //radial
			g=gc.createRadialGradient(rx2,ry2,0,rx,ry2,1);
			g.addColorStop(1,calcColor(color,-0x30,opacity));
			g.addColorStop(0,calcColor(color,0x30,opacity));
			break;
		}
		return g ? gc.fillStyle=g : false;
	},

	//set shadow
	setShadow=function(s){
		if(s && gc.hasOwnProperty('shadowBlur')) {
			var p=s.split(/[ ,;:-]/);
			gc.shadowOffsetX = parseInt(p[0]||1,10);
			gc.shadowOffsetY = parseInt(p[1]||1,10);
			gc.shadowBlur    = parseInt(p[2]||1,10);
			gc.shadowColor   = p[3]||'#000';
		}
	},

	//unset shadow
	unsetShadow=function(){
		if(gc.hasOwnProperty('clearShadow')) gc.clearShadow();
		else if(gc.hasOwnProperty('shadowBlur')) {
			gc.shadowOffsetX = 0;
			gc.shadowOffsetY = 0;
			gc.shadowBlur    = 0;
			gc.shadowColor   = 'rgba(0,0,0,0)';
		}
	},

	//erase canvas
	cls=function() {
		gc.clearRect(0,0,w,h);
		if(bg) {
			gc.fillStyle=bg;
			gc.fillRect(0,0,w,h);
		}
	},

	drawTitle=function() {
		if(title) {
			setShadow(title.shadow);
			gc.font=title.font;
			gc.textAlign='left';
			gc.textBaseline='top';
			gc.fillStyle=title.color;
			gc.fillText(title.text,title.x,title.y);
			unsetShadow();
		}
	},
	
	//draw the background grid
	drawGrid=function() {
		if(/chart|line|curve/.test(mode)) {
			var i,l,x,y;
			gc.lineWidth=grid.linewidth || 1;
			gc.strokeStyle=grid.color;
			//console.log("[harry] grid x("+grid.x.join(",")+") y("+grid.y.join(",")+")"); 
			if(grid.x)
				for(i=0,l=grid.x.length;i<l;++i) {
					x=rx+Math.round(rw*grid.x[i]/100);
					gc.beginPath();
					gc.moveTo(x,ry);
					gc.lineTo(x,ry2);
					gc.stroke();
				}
			if(grid.y)
				for(i=0,l=grid.y.length;i<l;++i) {
					y=ry2-Math.round(rh*grid.y[i]/100);
					gc.beginPath();
					gc.moveTo(rx,y);
					gc.lineTo(rx2,y);
					gc.stroke();
				}
		}
	},

	//draw labels on Y axis
	drawYLabels=function() {
		if(dlen && labels.y) {
			//console.log("[harry] labels y("+labels.y.join(",")+") "+labels.font);
			if(/chart|line|curve/.test(mode)) {
				var
				i,l,x,y,w,v,dec=drng<10?100:(drng<100?10:1);
				setShadow(labels.shadow);
				gc.font=labels.font;
				gc.fillStyle=labels.color;
				gc.textBaseline='middle';				
				for(i=0,l=labels.y.length;i<l;++i) {
					y=ry2-Math.round(rh*labels.y[i]/100);
					v=dinc+drng*labels.y[i]/100;
					v=Math.round(dec*v)/dec;
					if(/r/i.test(labels.ypos)){
						x=rx2+1;
						gc.textAlign='left';
						gc.fillText(v,x,y);
					}
					if(/l/i.test(labels.ypos)){
						x=rx-2;
						gc.textAlign='right';
						gc.fillText(v,x,y);
					}
				}
				unsetShadow();
			}
		}
	},

	//draw labels on X axis
	drawXLabel=function(n,x,y,align,baseline) {
		gc.save();
		if(labels.x && (n%labels.x)==0) {
			var l=data[0].lab[n]||n;
			setShadow(labels.shadow);
			gc.font=labels.font;
			gc.fillStyle=labels.color;
			gc.textAlign=align||'center';
			gc.textBaseline=baseline||'alphabetic';
			gc.fillText(l,x,y);
			unsetShadow();
		}
		if(labels.marks) {
			gc.lineWidth=1;
			gc.beginPath();
			gc.moveTo(x,ry2);
			gc.lineTo(x,ry2+labels.marks);
			gc.strokeStyle=labels.color;
			gc.stroke();
		}
		gc.restore();
	},

	drawLegends=function() {
		if(legends!==false && dlen>1) {
			gc.save();
			gc.font=legends.font;
			var i,w,g,py,d,
			    tw=0,
			    s=3,
			    lh=fontPixSize(legends.font)+s,
			    bs=lh-s,
			    tx=s*2+bs,
			    nl=dlen,
			    h=s+lh*nl,
			    x=legends.x,
			    y=legends.y;
			for(i=0;i<nl;++i)
				if((w=gc.measureText(data[i].tit)).width>tw)
					tw=w.width;
			w=s*3+bs+tw;
			//draw background
			gc.lineWidth=1;
			if((g=legends.background)) {
				setShadow(legends.shadowbox);
				gc.fillStyle=g;
				gc.fillRect(x,y,w,h);
				unsetShadow();
			}
			if((g=legends.border)) {
				gc.strokeStyle=g;
				gc.strokeRect(x,y,w,h);
			}

			for(i=0,py=y+s;i<nl;++i,py+=lh) {
				d=data[i];
				//draw color box
				setShadow(legends.shadow);
				gc.fillStyle=d.col;
				gc.fillRect(x+s,py,bs,bs);
				unsetShadow();
				if((g=legends.border2)) {
					gc.strokeStyle=g;
					gc.strokeRect(x+s,py,bs,bs);
				}
				//draw text
				setShadow(legends.shadow);
				gc.textAlign='left';
				gc.textBaseline='top';
				gc.fillStyle=legends.color;
				gc.fillText(d.tit,x+s*2+bs,py);
				unsetShadow();
			}
			gc.restore();
		}
	},

	drawBullets=function(bs,center) { //[{x,y,r,v,n,nds}]
		gc.save();
		gc.font=mouseover.font;
		var i,n,m,l=bs.length,b,lab,tit,txt,bh=0,bw=0,s=3,
		    pt=fontPixSize(mouseover.font),
		    pr=pt/2,lh=pt+s,x,y,x1,y1,x2,y2,
		    xl=w,xr=0,yt=h,yb=0;
		bs.sort(function(a,b){return parseInt(b.v,10)-parseInt(a.v,10)});
		//calc texts sizes
		for(n=0;n<l;n++){
			b=bs[n];
			lab=data[b.nds].lab[b.n];
			tit=data[b.nds].tit;
			txt=typeof(mouseover.text)=="function"
				? mouseover.text(b.n,b.v,lab,b.x,b.y)
				: mouseover.text.replace('%v',b.v).replace('%l',lab).replace('%n',b.n).replace('%t',tit).replace('%p',b.pct);
			if(txt) {
				b.lines=txt.split(/\n|\\n/);
				b.h=b.lines.length*lh;
				b.h2=Math.floor(b.h/2);
				b.w=0;
				for(i in b.lines)
					if((m=gc.measureText(b.lines[i]).width+s*2)>b.w)
						b.w=m;
				if(b.w>bw) bw=b.w;
				bh+=b.h;
				b.r++;
				if(xl>b.x-b.r) xl=b.x-b.r;
				if(xr<b.x+b.r) xr=b.x+b.r;
				if(yt>b.y) yt=b.y;
				if(yb<b.y) yb=b.y;
			}
		}
		//calc position
		if(l>1) bw+=s*2+pt;
		if(bh) {
			bh+=s;
			if(center) {
				x=xl+(xr-xl)/2;
				x1=x-(bw/2);
				if(x1+bw>w) x1=w-1-bw;
				if(x1<1) x1=1;
			} else {
				x1=xr;
				if(x1+bw>=w) x1=xl-bw;
				if(x1<1) x1=1;
			}
			x1=Math.floor(x1)+.5;
			x2=x1+bw;
			y=yt+bh/2;//+(yb-yt)/2;
			y1=y+(bh/2);
			if(y1>ry2) y1=ry2-1;
			y1=Math.floor(y1)+.5;
			y2=y1-bh;
			//draw bullet
			gc.beginPath();
			gc.moveTo(x1,y1);
			gc.lineTo(x2,y1);
			gc.lineTo(x2,y2);
			gc.lineTo(x1,y2);
			gc.closePath();
			if(mouseover.bullet){
				setShadow(mouseover.shadowbox);
				gc.strokStyle='';
				gc.fillStyle=mouseover.bullet;
				gc.fill();
				unsetShadow();
			}
			if(mouseover.border) {
				gc.lineWidth=1;
				gc.lineJoin='round';
				gc.strokeStyle=mouseover.border;
				gc.stroke();
			}
			//draw texts
			gc.textAlign='left';
			gc.textBaseline='top';
			y=y2+s;
			for(n=0;n<l;n++) {
				b=bs[n];
				x=x1+s;
				if(l>1) {
					gc.beginPath();
					gc.arc(x+pr,y+pr,pr,0,2*Math.PI);
					gc.fillStyle=data[b.nds].col;
					gc.fill();
					x+=pt+s;
				}
				setShadow(mouseover.shadow);
				gc.fillStyle=mouseover.color;
				for(i=0;i<b.lines.length;++i,y+=lh)
					gc.fillText(b.lines[i],x,y);
				unsetShadow();
			}
		}
		gc.restore();
	},

	plot={

		line: function(river,curve) {
			var nds=dlen,cy=drng?rh/drng:0,d,g,i,j,v,l,
			drawPath=function(gc,x,y,v,n1,n2) {
				var n=n1,nx,ny,mx,my,px,py;
				while(n<=n2) {
					if(v[n]===null)
						n++;
					else if(curve) {
						nx=x[n];
						ny=y[n];
						n++;
						while(n<=n2 && v[n]===null) n++;
						if(n>n2)
							gc.lineTo(nx,ny);
						else {
							mx=(nx+x[n])/2;
							my=(ny+y[n])/2;
							px=(nx+mx)/2;
							py=(ny+my)/2;
							gc.quadraticCurveTo(nx,ny,px,py);
							px=(mx+x[n])/2;
							py=(my+y[n])/2;
							gc.quadraticCurveTo(mx,my,px,py);
						}
					} else {
						gc.lineTo(x[n],y[n]);
						n++;
					}
				}
			};
			gc.lineWidth=linewidth;
			gc.lineJoin=linejoin;
			overpoints=[];

			while(d=data[--nds])
				if((l=d.len)>1) {
					//console.log("[harry] curve("+d.tit+")"+(river?" river":""));
					//calc
					var x=[],y=[],n1,n2;
					for(i=0;i<l;++i) {
						v=0;
						if(river) for(j=0;j<=nds;j++) v+=data[j].val[i]-dinc;
						else v=d.val[i]-dinc;
						x.push(rx+Math.round(i*(rw/(l-1))));
						y.push(ry2-Math.round(cy*v));
					}
					overpoints.push({x:x,y:y,v:data[nds].val,nds:nds});
					i--;
					x.push(rx+Math.round(i*(rw/(l-1))));
					y.push(ry2-Math.round(cy*v));
					//dont draw leading/ending null values
					n1=0;
					while(d.val[n1]===null) n1++;
					n2=l-1;
					while(d.val[n2]===null) n2--;
					//fill
					if(n1<=n2 && setGradient(d.col)) {
						gc.beginPath();
						gc.moveTo(x[n1],ry2);
						gc.lineTo(x[n1],y[n1]);
						drawPath(gc,x,y,d.val,n1,n2);
						gc.lineTo(x[n2],ry2);
						gc.closePath();
						gc.fill();
					}
					//draw lines
					gc.strokeStyle=d.col;
					gc.beginPath();
					gc.moveTo(x[n1],y[n1]);
					drawPath(gc,x,y,d.val,n1,n2);
					gc.stroke();
					//draw x labels
					if(nds==0)
						for(i=0;i<l;++i)
							drawXLabel(i,x[i],h-1);
					//draw points
					if(radiuspoint) {
						gc.fillStyle=d.col;
						for(i=0;i<l;++i)
							if(d.val[i]!=undefined){
								gc.beginPath();
								gc.arc(x[i],y[i],radiuspoint,0,2*Math.PI);
								gc.closePath();
								gc.fill();
							}
					}
				}
		},

		curve: function(river) { 
			plot.line(river,true);
		},

		chart: function(stack) {
			//console.log("[harry] chart ("+dlen+" dataset)");
			overpoints = [];
			if(dlen){
				var nd,nds,nbd=data[0].len,m=dlen>1?4:0,nbdsv=stack?1:dlen,
				    bw=(nbd && dlen)?(((rw-(m*(nbd-1)))/nbd)/nbdsv)-1:0,d,g,y,y0,
				    x=rx,x1,x2,cy=stack?(dsum?rh/dsum:0):(dmax?rh/dmax:0);
				if(bw<0) bw=0;
				gc.lineWidth=linewidth;
				gc.lineJoin="miter";
				for(nds=0;nds<dlen;nds++) overpoints.push({x:[],y:[],v:[],nds:nds});
				for(nd=0;nd<nbd;nd++) {
					drawXLabel(nd,x+(((bw+1)*nbdsv)/2),h-1);
					y=ry2;
					for(nds=0;nds<dlen;nds++) {
						d=data[nds];
						y0=stack?y:ry2;
						y=y0-Math.round(cy*d.val[nd]);
						x1=Math.round(x);
						x2=Math.round(x+bw);
						if(d.val[nd]!==null) {
							gc.beginPath();
							gc.moveTo(x1,y0);
							gc.lineTo(x1,y);
							gc.lineTo(x2,y);
							gc.lineTo(x2,y0);
							gc.closePath();
							if(setGradient(d.col)) gc.fill();
							gc.strokeStyle=d.col;
							gc.stroke();
						}
						overpoints[nds].x.push(0.5+Math.floor(x+bw/2));
						overpoints[nds].y.push(y);
						overpoints[nds].v.push(d.val[nd]);
						if(!stack) x+=bw+1;
					}
					x+=stack?bw+1+m:m;
				}
			}
		},

		pie: function() {
			//console.log("[harry] pie ("+dlen+" dataset)");
			overpoints = [];
			if(dlen){
				//precalc angles
				var i,nb=0,va=[],vc=[],pi2=Math.PI*2,lab=[],pct=[];
				if(dlen>1) {
					var sum=0;
					for(i=0;i<dlen;i++) sum+=data[i].sum;
					if(sum)
						for(i=0,nb=dlen;i<dlen;i++) {
							va[i]=data[i].sum/sum*pi2;
							vc[i]=data[i].col;
							lab.push(data[i].sum);
							pct.push(Math.round(100*data[i].sum/sum));
						}
				} else {
					var d=data[0];
					if(d.sum)
						for(nb=d.len,i=0;i<nb;i++) {
							va[i]=d.val[i]/d.sum*pi2;
							vc[i]=COLORS[i%COLORS.length];
							lab.push(d.val[i]);
							pct.push(Math.round(100*d.val[i]/d.sum));
						}
				}
				//draw
				var cx=rx+Math.round(rw/2),cy=ry+Math.round(rh/2),
				    r=Math.min(rh/2,rw/2)-1, rl=r+labels.fontpx,dx,dy,
				    g,a1=Math.PI*1.5,a2,a,nx,ny,n=overpie.n;
				overpie={r:r,x:cx,y:cy,n:n};
				gc.lineWidth=linewidth;
				gc.lineJoin="miter";
				for(i=0;i<nb;i++) {
					a2=a1+va[i];
					a=(a1+a2)/2;
					overpoints.push({a:a1%(2*Math.PI),n:i});
					if(i===n) {
						dx=cx+Math.cos(a)*10;
						dy=cy+Math.sin(a)*10;
					} else {
						dx=cx;
						dy=cy;
					}
					gc.beginPath();
					gc.moveTo(dx,dy);
					gc.arc(dx,dy,r,a1,a2,false);
					gc.closePath();
					if(setGradient(vc[i])) gc.fill();
					gc.strokeStyle=vc[i];
					gc.stroke();
					if(i===n) {
						nx=dx+rl/2*Math.cos(a);
						ny=dy+rl/2*Math.sin(a);
					} else
						drawXLabel(lab[i],dx+rl*Math.cos(a),dy+rl*Math.sin(a),'center','middle');
					a1=a2;
				}
				if(n!==false) drawBullets([{
					x: nx,
					y: ny,
					r: 0,
					v: lab[n],
					pct: pct[n]+'%',
					n: n,
					nds: dlen>1?n:0
				}], true);
				overpoints.sort(function(a,b){return a.a-b.a});
			}
		}
	},

	over={

		line: function(x,y,river,curve) {
			var i,n=false,o,xmin,lw=mouseover.linewidth||1,bs=[];
			if(overpoints.length) {
				o=overpoints[0];
				for(i=0;i<o.x.length;++i)
					if(o.v[i]!=undefined && (Math.abs(x-o.x[i])<xmin || n===false)) {
						xmin=Math.abs(x-o.x[i]);
						n=i;
					}
				if(n!==false) {
					for(i=0;i<overpoints.length;++i) {
						o=overpoints[i];
						if(o.v[n]!=undefined) {
							if(mouseover.border2) {
								gc.beginPath();
								gc.lineWidth=lw+2;
								gc.arc(o.x[n],o.y[n],mouseover.radius,0,2*Math.PI);
								if(mouseover.linewidth==0) {
									gc.fillStyle=mouseover.border2;
									gc.fill();
								} else {
									gc.strokeStyle=mouseover.border2;
									gc.stroke();
								}
							}
							gc.beginPath();
							gc.lineWidth=lw;
							gc.arc(o.x[n],o.y[n],mouseover.radius,0,2*Math.PI);
							if(mouseover.linewidth==0) {
								gc.fillStyle=mouseover.circle;
								gc.fill();
							} else {
								gc.strokeStyle=mouseover.circle;
								gc.stroke();
							}
							if(mouseover.axis){
								var xy,z,s=2;
								gc.lineWidth=1;
								//draw axis
								if(/x/i.test(mouseover.axis)){
									z=o.y[n]+mouseover.radius;
									while(z<ry2){
										gc.moveTo(o.x[n],z);
										z+=s;
										if(z>ry2) z=ry2;
										gc.lineTo(o.x[n],z);
										z+=s;
									}
									gc.stroke();
								}
								if(/y/i.test(mouseover.axis)){
									x=o.x[n]+mouseover.radius;
									while(x<rx2){
										gc.moveTo(x,o.y[n]);
										x+=s;
										if(x>rx2) x=rx2;
										gc.lineTo(x,o.y[n]);
										x+=s;
									}
									gc.stroke();
								}
							}
							bs.push({
								x: o.x[n],
								y: o.y[n],
								r: lw/2+1+mouseover.radius,
								v: o.v[n],
								n: n,
								nds: o.nds
							})
						}
					}
					drawBullets(bs);
				}
			}
		},

		chart: function(x,y,stack) {
			over.line(x,y);
		},
		

		curve: function(x,y,river) {
			over.line(x,y,river,true);
		},

		pie: function(x,y) {
			var d=Math.sqrt(Math.pow(x-overpie.x,2)+Math.pow(y-overpie.y,2)),a,n,i=0;
			if(d<=overpie.r){
				a=Math.PI-Math.atan2(overpie.y-y,x-overpie.x);
				a=(a+3*Math.PI)%(2*Math.PI);
				while(i<overpoints.length && a>overpoints[i].a) i++;
				if(--i<0) i=overpoints.length-1;
				overpie.n=overpoints[i].n;
				draw(true);
			} else if(overpie.n!==false) {
				overpie.n=false;
				draw(true);
			}
		}

	},

	clear=function() {
		data=[];
		dlen=0;
	};

	draw=function(nover) {
		//console.log("[harry] draw("+mode+")");
		var
		args=mode.split(/:/),
		m=args[0],
		o=args[1]||false;
		cls();
		drawGrid();
		drawYLabels();
		if(title && title.z=='top') {
			plot[m](o);
			drawTitle();
		} else {
			drawTitle();
			plot[m](o);
		}
		drawLegends();
		if(!nover) {
			canvas.onmouseover=
			canvas.onmousemove=
			canvas.onmouseout=undefined;
			overpie.n=false;
			if(mouseover) {

				imgdata = gc.getImageData(0,0,w,h);
				if(mousepos) over[m](mousepos.x,mousepos.y,o);

				canvas.onmouseover=function(e){
					mousepos=mouseXY(e);

				};
				canvas.onmousemove=function(e){
					if(mousepos) {
						if(m!="pie") gc.putImageData(imgdata,0,0);
						mousepos=mouseXY(e);
						over[m](mousepos.x,mousepos.y,o);
					};
				};
				canvas.onmouseout=function(){
					mousepos=undefined;
					gc.putImageData(imgdata,0,0);
				};

			} else
				mousepos=undefined;
		}
	};
	
//INIT ========================================================================

	//console.log("[harry] init("+w+","+h+")");
	labels.fontpx=fontPixSize(labels.font);
	if(/none|false/.test(grid.x)) grid.x=[];
	if(/none|false/.test(grid.y)) grid.y=[];
	rx=margins[3]+0.5;
	ry=margins[0]+0.5;
	rw=Math.max(w-margins[1]-margins[3],0);
	rh=Math.max(h-margins[0]-margins[2],0);
	rx2=rx+rw;
	ry2=ry+rh;

	if(o.datas) loads(o.datas);
	draw();

//PUBLIC METHODS ==============================================================

	return {
		canvas: canvas,
		data: data,
		clear: function() {
			clear();
			return this;
		},
		load: function(d) {
			loads(d);
			return this;
		},
		cls: function(){
			//console.log("harry.cls() is obsolete, cls is performed by draw()");
			return this;
		},
		draw: function(m) {
			if(m) {
				mode=m.toLowerCase();
				setup();
			}
			draw();
			return this;
		}
	};
}),
plotter=harry;
