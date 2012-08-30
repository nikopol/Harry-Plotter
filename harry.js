// harry plotter 0.5
// ~L~ nikomomo@gmail.com 2009-2012
// https://github.com/nikopol/Harry-Plotter

/*
//everything is optional, if data are provided, the graph is directly drawn
var h=new harry({

	//datas can be provided in these formats :
	datas: [v1,v2,v3,...],        //simple dataset values
	datas: [[v1,v2],[w1,w2],...], //multiple dataset values
	datas: {                      //simple dataset with color and title
		values: [v1,v2,...],
		title: "my dataset #1",
		color: "#fc0"
	}
	datas: [                      //multiple dataset with color and title
		{ values:[...],title:"...",color:"..." },
		{ values:[...],title:"...",color:"..." }
	],

	id: "str",                    //canvas's id, by default harry$n
	container: "str/elem",	      //container where to append canvas, default=body
	canvas: "str/elem",           //canvas element, default=create it into container
	width: int,                   //canvas's width, default=container.width or 300
	height: int,                  //canvas's  height, default=container.height or 80
	mode: "pie|chart|chart:stack|line|line:river|curve|curve:river",
	                              //draw mode, default=line
	linewidth: int,               //line width, default=1
	linejoin: "round|bevel|miter" //line join, default=miter
	fill: "none|auto|solid|vertical|horizontal|radial", 
	                              //fill style (only first letter matter), default=auto
	opacity: 0.8,                 //fill opacity, between 0 and 1, override if fill=auto
	title: {                      //title options
		font:'9px "Trebuchet MS"',//  font size & family, default=normal 9px "Sans Serif"
		color: "rgba(4,4,4,0.3)", //  font color, default=rgba(4,4,4,0.3)
		text: "title"             //  clear enough
		x: 5,                     //  title position x
		y: 10                     //  title position y
		z: "top|background|bg"    //  behind or on top of the graphn default=top
	},
	labels: {                     //labels options
		font: "9px Trebuchet MS", //  font size & family, important:use px size,
		                          //    default=normal 9px "Sans Serif"
		color: "#a0a0a0",         //  font color, default=a0a0a0
		y: [0,50,100,"max|min|avg"]// y legend, numbers are %, default=none
		x: ['label 1','lab 2',etc]//  'all' display data index, or array of labels
		stepx: 1                  //  draw each stepx between labels (2 print one label
	},                            //    on two), default=none
	grid: {                       //grid options
		color:"#a0a0a0",          //  grid color, default=#a0a0a0
		y: [0,50,100]             //  y legend, number are %, default=[0,25,50,75,100]
		x: [0,100]                //  x legend, number are %, default=[0,100]
	},
	margins:[top,right,bot,left], //margin size (for labels), default=auto
	autoscale: true,              //auto round up y scale, default=true (unused for pie)
	pointradius: int,             //radius point in mode line/curve only (default=none)
	mouseover: {,                 //set to false to disable mouseover, default=enabled
		radius: int,              //  spot radius, default=5
		linewidth: int,           //  spot linewidth, default=linewidth below,0=fill
		circle: "#888888",        //  spot color, default=#888
		font: "9px Trebuchet MS", //  bullet text font, default=normal 9px "Sans Serif"
		color: "#666",            //  bullet text color, default=#fff
		bullet: "rgba(0,0,0,0.5)" //  bullet background color, default=#888
		border: "#fc0"            //  bullet border color, default=#fff,
		axis: "xy|x|y"            //  draw spot axis, default=none
	}
});

h.clear()          //delete all dataset
 .cls()            //erase canvas
 .addDataSet(data) //add a dataset, see contructor
 .draw();          //draw all dataset
h.mode('river')    //change mode
 .draw();          //redraw

*/

var harryTools={
	COLORS: ["#88a4d7","#d685c9","#86d685","#ffc34f","#93c2ea","#f28989","#f9eb8a"],
	count: 0,
	getRGB: function(color) {
		var result;
		if(color && color.constructor==Array && color.length==3) return color;
		if(result=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) return [parseInt(result[1],10), parseInt(result[2],10), parseInt(result[3],10)];
		if(result=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color)) return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];
		if(result=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)) return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];
		if(result=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color)) return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];
		return [0,0,0];
	},
	calcColor: function(color,delta,alpha){
		var rgb=harryTools.getRGB(color);
		if(typeof delta!="array") delta=[delta,delta,delta];
		for(var i=0;i<3;++i) rgb[i]=Math.max(Math.min(rgb[i]+delta[i],255),0);
		return (alpha!=undefined)?
			"rgba("+rgb.join(',')+","+alpha+")":
			"rgb("+rgb.join(',')+")";
	},
	fontPixSize: function(f) {
		var p=f.match(/\d+px/i);
		if(p) return parseInt(p,10);
		p=f.match(/[0-9\.]+em/i);
		if(p) return Math.floor(16.0*parseFloat(p,10));
		p=f.match(/\d+pt/i);
		if(p) return Math.floor(1.3333*parseInt(p,10));
		return 10;
	},
	scaleUp: function(n){
		var s=Math.floor(n).toString(),
			d=parseInt(s.substr(0,1)),
			m=d*parseFloat("1E"+(s.length-1));
		return m==n ? n : this.dmax=(d+1)*parseFloat("1E"+(s.length-1));
	}
};

var harry=function(o) {
	this.clear();
	if(o.canvas) {
		this.canvas=document.getElementById(o.canvas);
	} else {
		this.canvas=document.createElement('canvas');
		if(o.id) this.canvas.setAttribute('id',o.id);
		document.getElementById(o.container).appendChild(this.canvas);
		this.canvas.setAttribute('width',(o.width||300)+'px');
		this.canvas.setAttribute('height',(o.height||150)+'px');
	}
	this.w=this.canvas.width;
	this.h=this.canvas.height;
	this.id=o.id || "harry"+(++harryTools.count);
	this.setmode(o.mode);
	this.fill=(o.fill || "auto")[0].toLowerCase().replace(/[^nasvhr]/,"a");
	this.opacity=parseFloat(o.opacity,10) || 1;
	this.linewidth=parseInt(o.linewidth,10) || 1;
	this.linejoin=o.linejoin || "miter";
	this.radiuspoint=parseInt(o.radiuspoint,10) || 0;
	this.labels=o.labels || {};
	this.labels.color=this.labels.color || "#a0a0a0";
	this.labels.font=this.labels.font || 'normal 9px "Sans Serif"';
	this.labels.fontpx=harryTools.fontPixSize(this.labels.font);
	this.labels.stepx=this.labels.stepx || 1;
	this.margins=o.margins || [0,0,0,0];
	this.autoscale=o.autoscale===false?false:true;
	if(o.mouseover===false) this.mouseover=false;
	else {
		o.mouseover = o.mouseover || {};
		this.mouseover={
			radius: o.mouseover.radius || 5,
			linewidth: o.mouseover.linewidth!=undefined?o.mouseover.linewidth:this.linewidth,
			circle: o.mouseover.circle || "#888",
			font:   o.mouseover.font   || 'normal 10px "Sans Serif"',
			color:  o.mouseover.color  || "#fff",
			bullet: o.mouseover.bullet || "#888",
			border: o.mouseover.border || "#fff"
		}
	}
	if(!o.margins) {
		if(/pie/.test(this.mode)) {
			var m=this.labels.x?this.labels.fontpx:0;
			this.margins=[m,m,m,m];
		} else {
			var m=this.labels.fontpx,sm=Math.floor(this.labels.fontpx/2);
			this.margins=[this.labels.y?sm:0,this.labels.y?m*4:1,this.labels.x?2+m:1,this.labels.x?sm:0];
		}
	}
	this.grid=o.grid || {};
	this.grid.color=this.grid.color || "#a0a0a0";
	this.grid.x=this.grid.x || [0,100];
	if(/none|false/.test(this.grid.x)) this.grid.x=[];
	this.grid.y=this.grid.y || [0,25,50,75,100];
	if(/none|false/.test(this.grid.y)) this.grid.y=[];
	this.title=o.title || false;
	if(this.title) {
		if(typeof this.title=="string") this.title={text:this.title};
		if(!this.title.font) this.title.font='bold 12px "Sans Serif","Trebuchet MS"';
		if(!this.title.color) this.title.color='rgba(4,4,4,0.3)';
		if(!this.title.x) this.title.x=this.margins[3]+2;
		if(!this.title.y) this.title.y=this.margins[0]+12;
	}
	this.gc=this.canvas.getContext("2d");
	//console.log("[harry] init("+this.w+","+this.h+")");
	if(o.datas) this.addDataSets(o.datas);
	this.rx=this.margins[3]+0.5;
	this.ry=this.margins[0]+0.5;
	this.rw=Math.max(this.w-this.margins[1]-this.margins[3],0);
	this.rh=Math.max(this.h-this.margins[0]-this.margins[2],0);
	this.rx2=this.rx+this.rw;
	this.ry2=this.ry+this.rh;
	this.draw();
}

harry.prototype={

	clear: function() {
		//console.log('[harry] clear');
		this.dataset=[];
		this.dmin=0xffffffff;
		this.dmax=0;
		return this;
	},

	setmode: function(m) {
		this.mode = m || 'line';
		return this;
	},

	addDataSets: function(datas) {
		if(datas.constructor==Array)
			for(var i=0,l=datas.length;i<l;++i)
				this.addDataSet(datas[i]);
		else
			this.addDataSet(datas);
		return this;
	},

	addDataSet: function(d,title,color,dmin,dmax) {
		var t,v,k,datas={
			val:[], lab:[], 
			len:0, sum:0, avg:0, max:dmax?dmax:0, min:dmin?dmin:0xffffffff, 
			tit:title || "dataset#"+(this.dataset.length+1),
			col:color || harryTools.COLORS[this.dataset.length%harryTools.COLORS.length]
		};
		for(k in d) {
			if(typeof d[k]!="function"){
				datas.val.push(v=parseFloat(d[k],10));
				datas.lab.push(k);
				datas.sum+=v;
				if(v>datas.max) datas.max=v;
				if(v<datas.min) datas.min=v;
			}
		}
		datas.len=datas.val.length;
		datas.avg=(datas.len) ? datas.sum/datas.len : 0;
		this.dataset.push(datas);
		this.dlen=this.dataset.length;
		if(this.dlen==1) {
			this.dmin=datas.min;
			this.dmax=this.autoscale?harryTools.scaleUp(datas.max):datas.max;
			this.dsum=this.dmax;
			t=datas.tit;
		} else {
			this.dmin=Math.min(datas.min,this.dmin);
			this.dmax=Math.max(datas.max,this.dmax);
			this.dsum = 0;
			for(var i=0,l=this.dataset[0].val.length;i<l;++i){
				var sum=0;
				for(var j=0;j<this.dataset.length;++j) sum+=(this.dataset[j].val[i]||0);
				if(sum>this.dsum) this.dsum=this.autoscale?harryTools.scaleUp(sum):sum;
			}
		}
		//console.log("[harry] addDataSet "+datas.tit+" len="+this.dlen+" sum="+this.dsum+" max="+this.dmax);
		return this;
	},
	
	draw: function(mode) {
		this.mode=(mode || this.mode).toLowerCase();
		//console.log("[harry] draw("+this.mode+")");
		var args=this.mode.split(/:/);
		this.drawGrid().drawYLabels()[args[0]](args.length==1?false:args[1]).drawTitle();
		if(this.mouseover && this[args[0]+'Over']){
			var self = this;
			this.imgdata = this.gc.getImageData(0,0,this.w,this.h);
			if(this.mousepos != undefined) self[args[0]+'Over'](self.mousepos.x,self.mousepos.y,args[1]);
			this.canvas.onmouseover=function(){
				self.canvas.onmousemove=function(e){
					e=e||window.event;
					self.gc.putImageData(self.imgdata,0,0);
					//self.mousepos={x:e.pageX-self.canvas.offsetLeft,y:e.pageY-self.canvas.offsetTop};
					self.mousepos={x:e.offsetX,y:e.offsetY};
					self[args[0]+'Over'](self.mousepos.x,self.mousepos.y,args[1]);
				};
			};
			this.canvas.onmouseout=function(){
				self.mousepos=undefined;
				self.canvas.onmousemove=null;
				self.gc.putImageData(self.imgdata,0,0);
			};
		}
		return this;
	},
	
	cls: function() {
		this.gc.clearRect(0,0,this.w,this.h);
		return this;
	},

	drawTitle: function() {
		if(this.title && this.gc.font) {
			this.gc.font=this.title.font;
			this.gc.textAlign='left';
			this.gc.textBaseline='alphabetic';
			this.gc.fillStyle=this.title.color;
			this.gc.fillText(this.title.text,this.title.x,this.title.y);
		}
		return this;
	},
	
	drawGrid: function() {
		if(/chart|line|curve/.test(this.mode)) {
			var i,l,x,y;
			this.gc.lineWidth=this.grid.linewidth || 1;
			this.gc.strokeStyle=this.grid.color;
			//console.log("[harry] grid x("+this.grid.x.join(",")+") y("+this.grid.y.join(",")+")"); 
			if(this.grid.x)
				for(i=0,l=this.grid.x.length;i<l;++i){
					x=this.rx+Math.round(this.rw*this.grid.x[i]/100);
					this.gc.beginPath();
					this.gc.moveTo(x,this.ry);
					this.gc.lineTo(x,this.ry2);
					this.gc.stroke();
				}
			if(this.grid.y)
				for(i=0,l=this.grid.y.length;i<l;++i){
					//y=this.ry2-(this.grid.y[i] ? Math.round(this.rh*this.grid.y[i]/100) : 0);
					y=this.ry2-Math.round(this.rh*this.grid.y[i]/100);
					this.gc.beginPath();
					this.gc.moveTo(this.rx,y);
					this.gc.lineTo(this.rx2,y);
					this.gc.stroke();
				}
		}
		return this;
	},

	drawYLabels: function() {
		if(this.dlen && this.labels.y && this.gc.font) {
			//console.log("[harry] labels y("+this.labels.y.join(",")+") "+this.labels.font);
			if(/chart|line|curve/.test(this.mode)) {
				var max=/\:[r|s]/.test(this.mode)?this.dsum:this.dmax;
				var i,l,x,y,w,v,dec=max<10?100:(max<100?10:1);
				var fh=this.labels.fontpx;
				var fh2=Math.floor(fh/2.5);
				this.gc.font=this.labels.font;
				this.gc.fillStyle=this.labels.color;
				this.gc.textAlign='left';
				for(i=0,l=this.labels.y.length;i<l;++i){
					x=this.rx2+1;
					y=this.ry2-Math.round(this.rh*this.labels.y[i]/100);
					v=Math.round(dec*max*this.labels.y[i]/100)/dec;
					this.gc.fillText(v,x,y+fh2);
				}
			} else if(/pie/.test(this.mode)) {

			}
		}
		return this;
	},

	drawXLabel: function(n,x,y,align,baseline) {
		if(this.gc.font && this.labels.x && (n%this.labels.stepx)==0) {
			var l=(typeof this.labels.x=="object")
					?(this.labels.x[n]==undefined?'':this.labels.x[n])
					:n;
			this.gc.font=this.labels.font;
			this.gc.fillStyle=this.labels.color;
			this.gc.textAlign=align||'center';
			this.gc.textBaseline=baseline||'alphabetic';
			this.gc.fillText(l,x,y);
		}
		return this;
	},

	drawBullet: function(x,y,r,text,mod) {
		this.gc.font=this.mouseover.font;
		var x1,y1,x2,y2,s=3,m,
			h=harryTools.fontPixSize(this.mouseover.font)+s*2,
			h2=Math.floor(h/2),
			w=this.gc.measureText(text).width+s*2;
		//left
		x1=x+r;
		x2=x1+w;
		if(x2>=this.rw || (mod%2 && (x-r-w)>0)){
			//right
			x2=x-r;
			x1=x2-w;
		}
		y1=y+h2;
		y2=y1-h;
		if(y1>=this.rh) {
			y1=this.rh-0.5;
			y2=y1-h;
		} else if(y2<0) {
			y2=1.5;
			y1=y2+h;
		}
		//draw bullet
		this.gc.beginPath();
		this.gc.moveTo(x1,y1);
		this.gc.lineTo(x2,y1);
		this.gc.lineTo(x2,y2);
		this.gc.lineTo(x1,y2);
		this.gc.closePath();
		this.gc.fillStyle=this.mouseover.bullet;
		this.gc.fill();
		this.gc.lineWidth=1;
		this.gc.lineJoin='round';
		this.gc.strokeStyle=this.mouseover.border;
		this.gc.stroke();
		//draw text
		this.gc.textAlign='left';
		this.gc.textBaseline='middle';
		this.gc.fillStyle=this.mouseover.color;
		this.gc.fillText(text,x1+s-1,y2+h2);
		//console.log(text,'x',x1,x2,'w',this.rw,'y',y1,y2,'h',this.rh)
		return this;
	},
	
	pie: function() {
		var nbds=this.dlen;
		//console.log("[harry] pie ("+nbds+" dataset)");
		if(nbds){
			//precalc angles
			var i,nb=0,va=[],vc=[],pi2=Math.PI*2,labs=[],pc=/percent/.test(this.labels.x);
			if(nbds>1) {
				var sum=0;
				for(nb=nbds,i=0;i<nb;i++) sum+=this.dataset[i].avg;
				if(sum)
					for(i=0;i<nb;i++) {
						va[i]=this.dataset[i].avg/sum*pi2;
						vc[i]=this.dataset[i].col;
						labs.push(pc?
							Math.round(100*this.dataset[i].avg/sum)+'%':
							this.dataset[i].avg.toString()
						);
					}
			} else {
				var d=this.dataset[0];
				if(d.sum)
					for(nb=d.len,i=0;i<nb;i++) {
						va[i]=d.val[i]/d.sum*pi2;
						vc[i]=harryTools.COLORS[i%harryTools.COLORS.length];
						labs.push(pc?
							Math.round(100*d.val[i]/d.sum)+'%':
							d.val[i].toString()
						);
					}
			}
			//draw
			var cx=this.rx+Math.round(this.rw/2),cy=this.ry+Math.round(this.rh/2);
			var r=Math.min(this.rh/2,this.rw/2)-1, rl=r+this.labels.fontpx*0.7;
			var g,a1=-Math.PI/2,a2,a;
			var l
			this.gc.lineWidth=this.linewidth;
			this.gc.lineJoin="miter";
			for(i=0;i<nb;i++) {
				a2=a1+va[i];
				g=this.getGradient(vc[i]);
				this.gc.beginPath();
				this.gc.moveTo(cx,cy);
				this.gc.arc(cx,cy,r,a1,a2,false);
				this.gc.closePath();
				if(g) {
					this.gc.fillStyle=g;
					this.gc.fill();
				}
				this.gc.strokeStyle=vc[i];
				this.gc.stroke();
				a=(a1+a2)/2;
				this.drawXLabel(labs[i],cx+rl*Math.cos(a),cy+rl*Math.sin(a),'center','middle');
				a1=a2;
			}
		}
		return this;
	},
	
	chart: function(stack) {
		var nbds=this.dlen;
		//console.log("[harry] chart ("+nbds+" dataset)");
		this.overpoints = [];
		if(nbds){
			var nd,nds,nbd=this.dataset[0].len,m=nbds>1?4:0,nbdsv=stack?1:nbds,
			    bw=(nbd && nbds)?(((this.rw-(m*(nbd-1)))/nbd)/nbdsv)-1:0;
			if(bw<0) bw=0;
			var d,g,y,x=this.rx,x1,x2,cy=stack?(this.dsum?this.rh/this.dsum:0):(this.dmax?this.rh/this.dmax:0);
			this.gc.lineWidth=this.linewidth;
			this.gc.lineJoin="miter";
			for(nds=0;nds<nbds;nds++) this.overpoints.push({x:[],y:[],v:[]});
			for(nd=0;nd<nbd;nd++) {
				this.drawXLabel(nd,x+(((bw+1)*nbdsv)/2),this.h-1);
				y=this.ry2;
				for(nds=0;nds<nbds;nds++) {
					d=this.dataset[nds];
					y0=stack?y:this.ry2;
					y=y0-Math.round(cy*d.val[nd]);
					x1=Math.round(x);
					x2=Math.round(x+bw);
					this.gc.beginPath();
					this.gc.moveTo(x1,y0);
					this.gc.lineTo(x1,y);
					this.gc.lineTo(x2,y);
					this.gc.lineTo(x2,y0);
					this.gc.closePath();
					if(g=this.getGradient(d.col)){
						this.gc.fillStyle=g;
						this.gc.fill();
					}
					this.gc.strokeStyle=d.col;
					this.gc.stroke();
					this.overpoints[nds].x.push(0.5+Math.floor(x+bw/2));
					this.overpoints[nds].y.push(y);
					this.overpoints[nds].v.push(y);
					if(!stack) x+=bw+1;
				}
				x+=stack?bw+1+m:m;
			}
		}
		return this;
	},

	chartOver: function(x,y,stack) {
		return this.lineOver(x,y);
	},
	
	curve: function(river) { 
		return this.line(river,true);
	},

	curveOver: function(x,y,river) {
		return this.lineOver(x,y,river,true);
	},

	line: function(river,curve) {
		var nds=this.dlen,cy=river?(this.dsum?this.rh/this.dsum:0):(this.dmax?this.rh/this.dmax:0),
		    d,g,i,j,v,l;
		this.gc.lineWidth=this.linewidth;
		this.gc.lineJoin=this.linejoin;
		this.overpoints = [];
		while(d=this.dataset[--nds])
			if((l=d.val.length)>1) {
				//console.log("[harry] curve("+d.tit+")"+(river?" river":""));
				//calc
				var px,py,lx,ly,x=[],y=[],z;
				for(i=0;i<l;++i) {
					v=0;
					if(river) for(j=0;j<=nds;j++) v+=this.dataset[j].val[i];
					else v=d.val[i];
					x.push(this.rx+Math.round(i*(this.rw/(l-1))));
					y.push(this.ry2-Math.round(cy*v));
				}
				this.overpoints.push({x:x,y:y,v:this.dataset[nds].val});
				i--;
				x.push(this.rx+Math.round(i*(this.rw/(l-1))));
				y.push(this.ry2-Math.round(cy*v));
				//fill
				if(g=this.getGradient(d.col)){
					this.gc.beginPath();
					this.gc.moveTo(this.rx,this.ry2);
					this.gc.lineTo(x[0],y[0]);
					if(curve)
						for(i=1;i<=l;++i) {
							px=(x[i-1]+x[i])/2;
							py=(y[i-1]+y[i])/2;
							this.gc.quadraticCurveTo(x[i-1],y[i-1],px,py);
						}
					else
						for(i=0;i<l;++i)
							this.gc.lineTo(x[i],y[i]);
					this.gc.lineTo(this.rx2,this.ry2);
					this.gc.closePath();
					this.gc.fillStyle=g;
					this.gc.fill();
				}
				//draw lines
				this.gc.strokeStyle=d.col;
				this.gc.beginPath();
				this.gc.moveTo(x[0],y[0]);
				if(nds==0) this.drawXLabel(0,x[0],this.h);
				if(curve)
					for(i=1;i<=l;++i) {
						px=(x[i-1]+x[i])/2;
						py=(y[i-1]+y[i])/2;
						this.gc.quadraticCurveTo(x[i-1],y[i-1],px,py);
						if(nds==0 && i<l) this.drawXLabel(i,x[i],this.h);
					}
				else
					for(i=1;i<=l;++i) {
						this.gc.lineTo(x[i-1],y[i-1]);
						if(nds==0 && i<l) this.drawXLabel(i,x[i],this.h);
					}
				this.gc.stroke();
				if(this.radiuspoint) {
					this.gc.fillStyle=d.col;
					for(i=0;i<l;++i) {
						this.gc.beginPath();
						this.gc.arc(x[i],y[i],this.radiuspoint,0,2*Math.PI);
						this.gc.closePath();
						this.gc.fill();
					}
				}
			}
		return this;
	},

	lineOver: function(x,y,river,curve) {
		var i,n=false,xs,xmin;
		if(this.overpoints.length) {
			xs=this.overpoints[0].x;
			for(i=0;i<xs.length;++i) {
				if(Math.abs(x-xs[i])<xmin || n===false) {
					xmin=Math.abs(x-xs[i]);
					n=i;
				}
			}
			if(n!==false) {
				var lw=this.mouseover.linewidth||1;
				for(i=0;i<this.overpoints.length;++i) {
					var o=this.overpoints[i]
					this.gc.beginPath();
					this.gc.lineWidth=lw;
					this.gc.arc(o.x[n],o.y[n],this.mouseover.radius,0,2*Math.PI);
					if(this.mouseover.linewidth==0) {
						this.gc.fillStyle=this.mouseover.circle;
						this.gc.fill();
					} else {
						this.gc.strokeStyle=this.mouseover.circle;
						this.gc.stroke();

					}
					this.drawBullet(o.x[n],o.y[n],3+this.mouseover.radius,o.v[n],i);
				}
			}
		}
	},

	getFillMode: function() {
		if(this.fill=="a") {
			this.opacity=1;
			if(/\:river/.test(this.mode))  return "v";
			if(/line/.test(this.mode))     return this.dlen>1?"n":"v";
			if(/curve/.test(this.mode))    return this.dlen>1?"n":"v";
			if(/chart/.test(this.mode))    return this.dlen>1?"s":"v";
			if(/pie/.test(this.mode.test)) return "r";
			return "s";
		}
		return this.fill;
	},
	
	getGradient: function(color){
		//log("[harry] getGradient("+color+") type="+this.fill);
		var g=false;
		switch(this.getFillMode()) {
		case "s": //solid
			g=harryTools.calcColor(color,0x15,this.opacity);
			break;
		case "v": //vertical
			g=this.gc.createLinearGradient(0,this.ry2,0,this.ry);
			g.addColorStop(0,harryTools.calcColor(color,-0x30,this.opacity));
			g.addColorStop(1,harryTools.calcColor(color,0x30,this.opacity));
			this.gc.fillStyle=g;
			break;
		case "h": //horizontal
			g=this.gc.createLinearGradient(this.rx,0,this.rx2,0);
			g.addColorStop(0,harryTools.calcColor(color,-0x30,this.opacity));
			g.addColorStop(1,harryTools.calcColor(color,0x30,this.opacity));
			this.gc.fillStyle=g;
			break;
		case "r": //radial
			g=this.gc.createRadialGradient(this.rx2,this.ry2,0,this.rx,this.ry2,1);
			g.addColorStop(1,harryTools.calcColor(color,-0x30,this.opacity));
			g.addColorStop(0,harryTools.calcColor(color,0x30,this.opacity));
			this.gc.fillStyle=g;
			break;
		}
		return g;
	}
};

var plotter=function(d){return new harry(d)};