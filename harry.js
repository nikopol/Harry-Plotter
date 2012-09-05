// harry plotter 0.7
// ~L~ nikomomo@gmail.com 2009-2012
// https://github.com/nikopol/Harry-Plotter

/*

//everything in the constructor is optional
//if data are provided, the graph is directly drawn

var h=new harry({

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
	autoscale: true,              //auto round up y scale, default=true (unused for pie)
	pointradius: int,             //radius point in mode line/curve only (default=none)

	title: {                      //title options
		font:'9px "Trebuchet MS"',//  font size & family, default=bold 12px "Sans Serif"
		color: "rgba(4,4,4,0.3)", //  font color, default=rgba(4,4,4,0.3)
		text: "title",            //  clear enough
		x: 5,                     //  title position left position
		y: 10,                    //  title position top position
		z: "background"           //  behind or on top of the graph, default=top
	},

	labels: {                     //axis labels options
		font: "9px Trebuchet MS", //  font size & family, important:use px size,
		                          //    default=normal 9px "Sans Serif"
		color: "#a0a0a0",         //  font color, default=a0a0a0
		y: [0,50,100,"max|min|avg"],// y axis, numbers are %, default=none
		x: int,                   //  x axis, 1=draw all label, 2=one/two..., default=none
		marks: int                //  graduation's marks size, default=0
	},

	legends: {                    //set to false to disable legends box, default=auto
		x: int,                   //  left corner position, default=5
		y: int,                   //  top corner position,  default=5
		background: "rgba(180,180,180,0.5)",//background color, default=rgba(255,255,255,0.5)
		border: "#fff",           //  legends border color, default=none
		border2: "#fff",           // color box border color, default=fff
		color: "#000",            //  text color, default, #666
		font:'9px "Trebuchet MS"' //  font size & family, default=normal 10px "Sans Serif"
	},

	grid: {                       //grid options
		color:"#a0a0a0",          //  grid color, default=#a0a0a0
		y: [0,50,100],            //  y axis, numbers are %, default=[0,25,50,75,100]
		x: [0,100]                //  x axis, numbers are %, default=[0,100]
	},

	//interaction

	mouseover: {,                 //set to false to disable mouseover, default=enabled
		radius: int,              //  spot radius, default=5
		linewidth: int,           //  spot linewidth, default=linewidth below,0=fill
		circle: "#888888",        //  spot color, default=#888
		font: "9px Trebuchet MS", //  bullet text font, default=normal 9px "Sans Serif"
		color: "#666",            //  bullet text color, default=#fff
		bullet: "rgba(0,0,0,0.5)",//  bullet background color, default=rgba(99,99,99,0.8)
		border: "#fc0",           //  bullet border color, default=#fff,
		axis: "xy|x|y",           //  draw spot axis, default=none
		text: "%t\n%l: %v",       //  text in the bullet %v=value %l=label %n=index %t=title
		text: callback(n,v,l,x,y) //  or text can trigger a callback
		                          //     if it returns a string, it'll be displayed
	}
});

//or (same effect)
var h=plotter({...});


h.clear()          //delete all dataset
 .cls()            //erase canvas
 .addDataSet(data) //add a dataset, see contructor
 .draw();          //draw all dataset
h.canvas.onclick=function(){
	h.setMode('river') //change mode
	 .cls()            //erase canvas
	 .draw();          //redraw
};

*/

var harryTools={
	COLORS: ["#88a4d7","#d685c9","#86d685","#ffc34f","#93c2ea","#f28989","#f9eb8a"],
	count: 0,
	getRGB: function(color){
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
	fontPixSize: function(f){
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
		return m==n ? n : (d+1)*parseFloat("1E"+(s.length-1));
	},
	merge: function(a,b){
		if(typeof(b)=='object')
			for(var k in b)
				a[k]=b[k];
		return a;
	},
	mouseXY: function(e){
		return {
			x: e.offsetX!=undefined && e.offsetX || e.layerX!=undefined && e.layerX || e.clientX!=undefined && e.clientX,
			y: e.offsetY!=undefined && e.offsetY || e.layerY!=undefined && e.layerY || e.clientY!=undefined && e.clientY
		}
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
	this.bg=o.background;
	this.setMode(o.mode);
	this.fill=(o.fill || "a")[0].toLowerCase().replace(/[^nasvhrdl]/,"a");
	this.opacity=parseFloat(o.opacity,10) || 1;
	this.linewidth=parseInt(o.linewidth,10) || 1;
	this.linejoin=o.linejoin || "miter";
	this.radiuspoint=parseInt(o.radiuspoint,10) || 0;
	this.autoscale=o.autoscale===false?false:true;
	this.labels=harryTools.merge({
		color: "#a0a0a0",
		font: 'normal 9px "Sans Serif"',
		marks: 0
	},o.labels);
	this.labels.fontpx=harryTools.fontPixSize(this.labels.font);
	this.mouseover=o.mouseover===false
		? false
		: harryTools.merge({
			radius: 5,
			linewidth: this.linewidth,
			circle: "#888",
			font: 'normal 10px "Sans Serif"',
			color: "#fff",
			bullet: "rgba(99,99,99,0.8)",
			border: "#fff",
			axis: false,
			text: "%v"
		},o.mouseover);
	this.legends=o.legends===false
		? false
		: harryTools.merge({
			x: 5,
			y: 5,
			color: "#666",
			border2: "#fff",
			background: "rgba(255,255,255,0.5)",
			font: '10px "Sans Serif"'
		},o.legends);
	if(o.margins)
		this.margins=o.margins;
	else if(/pie/.test(this.mode)) {
		var m=this.labels.x?this.labels.fontpx*2:0;
		this.margins=[m,m,m,m];
	} else {
		var m=this.labels.fontpx,
		    f=Math.floor(this.labels.fontpx/2),
		    k=this.labels.marks;
		this.margins=[
			this.labels.y ? f : 0,     //top
			this.labels.y ? m*4 : 1,   //right
			this.labels.x ? 2+m+k : 1, //bottom
			this.labels.x ? f : 0,     //left
		];
	}
	this.grid=o.grid || {};
	this.grid.color=this.grid.color || "#a0a0a0";
	this.grid.x=this.grid.x || [0,100];
	if(/none|false/.test(this.grid.x)) this.grid.x=[];
	this.grid.y=this.grid.y || [0,25,50,75,100];
	if(/none|false/.test(this.grid.y)) this.grid.y=[];
	if(typeof o.title=="string") o.title={text:o.title};
	this.title=o.title
		? harryTools.merge({
			font: 'bold 12px "Sans Serif"',
			color: 'rgba(4,4,4,0.3)',
			x: this.margins[3]+2,
			y: this.margins[0]+2,
			z: 'top'
		},o.title)
		: false;
	this.gc=this.canvas.getContext("2d");
	//console.log("[harry] init("+this.w+","+this.h+")");
	if(o.datas) this.addDataSets(o.datas);
	this.rx=this.margins[3]+0.5;
	this.ry=this.margins[0]+0.5;
	this.rw=Math.max(this.w-this.margins[1]-this.margins[3],0);
	this.rh=Math.max(this.h-this.margins[0]-this.margins[2],0);
	this.rx2=this.rx+this.rw;
	this.ry2=this.ry+this.rh;
	this.overpie={n:false};
	this.cls().draw();
}

harry.prototype={

	clear: function() {
		//console.log('[harry] clear');
		this.dataset=[];
		this.dmin=0xffffffff;
		this.dmax=0;
		return this;
	},

	setMode: function(m) {
		this.mode = m || 'line';
		return this;
	},

	addDataSets: function(datas) {
		if(datas.constructor==Array && typeof(datas[0])=='object')
			for(var i=0,l=datas.length;i<l;++i)
				this.addDataSet(datas[i]);
		else
			this.addDataSet(datas);
		return this;
	},

	addDataSet: function(d) {
		var t,v,k,vals=d.values||d,labs=d.labels||[],
		ds={
			val:[], lab:[], 
			len:0, sum:0, avg:0, max:0, min:0xffffffffffff,
			tit:d.title || "dataset#"+(this.dataset.length+1),
			col:d.color || harryTools.COLORS[this.dataset.length%harryTools.COLORS.length]
		};
		for(k in vals) {
			v=parseFloat(vals[k],10);
			ds.val.push(vals[k]==null?null:v);
			ds.lab.push(labs[k]||k);
			ds.sum+=v;
			if(v>ds.max) ds.max=v;
			if(v<ds.min) ds.min=v;
		}
		ds.len=ds.val.length;
		ds.avg=ds.len ? ds.sum/ds.len : 0;
		this.dataset.push(ds);
		this.dlen=this.dataset.length;
		if(this.dlen==1) {
			this.dmin=ds.min;
			this.dmax=this.autoscale?harryTools.scaleUp(ds.max):ds.max;
			this.dsum=this.dmax;
			t=ds.tit;
		} else {
			this.dmin=Math.min(ds.min,this.dmin);
			this.dmax=Math.max(ds.max,this.dmax);
			this.dsum = 0;
			for(var i=0,l=this.dataset[0].val.length;i<l;++i){
				var sum=0;
				for(var j=0;j<this.dataset.length;++j) sum+=(this.dataset[j].val[i]||0);
				if(sum>this.dsum) this.dsum=this.autoscale?harryTools.scaleUp(sum):sum;
			}
		}
		//console.log("[harry] addDataSet "+ds.tit+" len="+this.dlen+" sum="+this.dsum+" max="+this.dmax);
		return this;
	},
	
	draw: function(mode,nover) {
		this.mode=(mode || this.mode).toLowerCase();
		//console.log("[harry] draw("+this.mode+")");
		var args=this.mode.split(/:/), self=this, fnover=args[0]+'Over';
		this.drawGrid().drawYLabels();
		if(this.title && this.title.z=='top') this[args[0]](args.length==1?false:args[1]).drawTitle();
		else                                  this.drawTitle()[args[0]](args.length==1?false:args[1]);
		this.drawLegends();
		if(!nover) {
			this.canvas.onmouseover=
			this.canvas.onmousemove=
			this.canvas.onmouseout=undefined;
			this.overpie.n=false;
			if(this.mouseover && this[args[0]+'Over']) {

				this.imgdata = this.gc.getImageData(0,0,this.w,this.h);
				if(this.mousepos) self[fnover](self.mousepos.x,self.mousepos.y,args[1]);

				this.canvas.onmouseover=function(e){
					self.mousepos=harryTools.mouseXY(e);
				};
				this.canvas.onmousemove=function(e){
					if(self.mousepos) {
						if(args[0]!="pie") self.gc.putImageData(self.imgdata,0,0);
						self.mousepos=harryTools.mouseXY(e||window.event);
						self[fnover](self.mousepos.x,self.mousepos.y,args[1]);
					};
				};
				this.canvas.onmouseout=function(){
					self.mousepos=undefined;
					self.gc.putImageData(self.imgdata,0,0);
				};

			} else
				this.mousepos=undefined;
		}
		return this;
	},
	
	cls: function() {
		this.gc.clearRect(0,0,this.w,this.h);
		if(this.bg) {
			this.gc.fillStyle=this.bg;
			this.gc.fillRect(0,0,this.w,this.h);
		}
		return this;
	},

	drawTitle: function() {
		if(this.title && this.gc.font) {
			this.gc.font=this.title.font;
			this.gc.textAlign='left';
			this.gc.textBaseline='top';
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
				for(i=0,l=this.grid.x.length;i<l;++i) {
					x=this.rx+Math.round(this.rw*this.grid.x[i]/100);
					this.gc.beginPath();
					this.gc.moveTo(x,this.ry);
					this.gc.lineTo(x,this.ry2);
					this.gc.stroke();
				}
			if(this.grid.y)
				for(i=0,l=this.grid.y.length;i<l;++i) {
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
				for(i=0,l=this.labels.y.length;i<l;++i) {
					x=this.rx2+1;
					y=this.ry2-Math.round(this.rh*this.labels.y[i]/100);
					v=Math.round(dec*max*this.labels.y[i]/100)/dec;
					this.gc.fillText(v,x,y+fh2);
				}
			}
		}
		return this;
	},

	drawXLabel: function(n,x,y,align,baseline) {
		if(this.gc.font && this.labels.x && (n%this.labels.x)==0) {
			var l=this.dataset[0].lab[n]||n;
			this.gc.font=this.labels.font;
			this.gc.fillStyle=this.labels.color;
			this.gc.textAlign=align||'center';
			this.gc.textBaseline=baseline||'alphabetic';
			this.gc.fillText(l,x,y);
		}
		if(this.labels.marks) {
			this.gc.save();
			this.gc.lineWidth=1;
			this.gc.moveTo(x,this.ry2);
			this.gc.lineTo(x,this.ry2+this.labels.marks);
			this.gc.strokeStyle=this.labels.color;
			this.gc.stroke();
			this.gc.restore();
		}
		return this;
	},

	drawLegends: function() {
		if(this.legends!==false && this.dlen>1) {
			this.gc.save();
			this.gc.font=this.legends.font;
			var i,w,g,py,
			  tw=0,
			  s=3,
			  lh=harryTools.fontPixSize(this.mouseover.font)+s,
			  bs=lh-s,
			  tx=s*2+bs,
			  nl=this.dlen,
			  h=s+lh*nl,
			  x=this.legends.x,
			  y=this.legends.y;
			for(i=0;i<nl;++i)
				if((w=this.gc.measureText(this.dataset[i].tit)).width>tw)
					tw=w.width;
			w=s*3+bs+tw;
			//draw background
			this.gc.lineWidth=1;
			if((g=this.legends.background)) {
				this.gc.fillStyle=g;
				this.gc.fillRect(x,y,w,h);
			}
			if((g=this.legends.border)) {
				this.gc.strokeStyle=g;
				this.gc.strokeRect(x,y,w,h);
			}
			for(i=0,py=y+s;i<nl;++i,py+=lh) {
				d=this.dataset[i];
				//draw color box
				this.gc.fillStyle=d.col;
				this.gc.fillRect(x+s,py,bs,bs);
				if((g=this.legends.border2)) {
					this.gc.strokeStyle=g;
					this.gc.strokeRect(x+s,py,bs,bs);
				}
				//draw text
				this.gc.textAlign='left';
				this.gc.textBaseline='top';
				this.gc.fillStyle=this.legends.color;
				this.gc.fillText(d.tit,x+s*2+bs,py);
			}
			this.gc.restore();
		}
		return this;
	},

	drawBullet: function(x,y,r,v,n,nds,center) {
		this.gc.save();
		this.gc.font=this.mouseover.font;
		var x1,y1,x2,y2,ly,lh,s=3,i,m,w=0,
		    lab=this.dataset[nds].lab[n],
		    tit=this.dataset[nds].tit,
		    text=typeof(this.mouseover.text)=="function"
		      ? this.mouseover.text(n,v,lab,x,y)
		      : this.mouseover.text.replace('%v',v).replace('%l',lab).replace('%n',n).replace('%t',tit),
		    lines=text.split(/\n|\\n/),
		    lh=harryTools.fontPixSize(this.mouseover.font)+s,
		    h=s+lines.length*lh,
		    h2=Math.floor(h/2);
		if(text) {
			for(i in lines)
				if((m=this.gc.measureText(lines[i]).width+s*2)>w)
					w=m;
			if(center) {
				x1=x+r-(w/2);
				if(x1<this.rx) x1=this.rx;
				x2=x1+w;
				if(x2>this.rx2) {
					x2 = this.rx2-1;
					x1 = x2-w;
				}
				y1=y+(h/2);
				if(y1>this.ry2) y1=this.ry2-1;
				y2=y1-h;
			} else {
				//left
				x1=x+r;
				x2=x1+w;
				if(x2>=this.rx2 || (nds%2 && (x-r-w)>0)){
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
			this.gc.textBaseline='top';
			this.gc.fillStyle=this.mouseover.color;
			for(i=0,ly=y2+s; i<lines.length; ++i,ly+=lh)
				this.gc.fillText(lines[i],x1+s,ly);
		}
		this.gc.restore();
		return this;
	},

	pie: function() {
		var nbds=this.dlen;
		//console.log("[harry] pie ("+nbds+" dataset)");
		this.overpoints = [];
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
			var cx=this.rx+Math.round(this.rw/2),cy=this.ry+Math.round(this.rh/2),
			    r=Math.min(this.rh/2,this.rw/2)-1, rl=r+this.labels.fontpx,dx,dy,
			    g,a1=Math.PI*1.5,a2,a,nx,ny,n=this.overpie.n;
			this.overpie={r:r,x:cx,y:cy,n:n};
			this.gc.lineWidth=this.linewidth;
			this.gc.lineJoin="miter";
			for(i=0;i<nb;i++) {
				a2=a1+va[i];
				a=(a1+a2)/2;
				this.overpoints.push({a:a1%(2*Math.PI),n:i});
				if(i===n) {
					dx=cx+Math.cos(a)*10;
					dy=cy+Math.sin(a)*10;
				} else {
					dx=cx;
					dy=cy;
				}
				g=this.getGradient(vc[i]);
				this.gc.beginPath();
				this.gc.moveTo(dx,dy);
				this.gc.arc(dx,dy,r,a1,a2,false);
				this.gc.closePath();
				if(g) {
					this.gc.fillStyle=g;
					this.gc.fill();
				}
				this.gc.strokeStyle=vc[i];
				this.gc.stroke();
				if(i===n) {
					nx=dx+rl/2*Math.cos(a);
					ny=dy+rl/2*Math.sin(a);
				} else
					this.drawXLabel(labs[i],dx+rl*Math.cos(a),dy+rl*Math.sin(a),'center','middle');
				a1=a2;
			}
			if(n!==false) this.drawBullet(nx,ny,0,labs[n],n,0,true);
			this.overpoints.sort(function(a,b){return a.a-b.a});
		}
		return this;
	},

	pieOver: function(x,y) {
		var d=Math.sqrt(Math.pow(x-this.overpie.x,2)+Math.pow(y-this.overpie.y,2)),a,n,i=0;
		if(d<=this.overpie.r){
			a=Math.PI-Math.atan2(this.overpie.y-y,x-this.overpie.x);
			a=(a+3*Math.PI)%(2*Math.PI);
			while(i<this.overpoints.length && a>this.overpoints[i].a) i++;
			if(--i<0) i=this.overpoints.length-1;
			this.overpie.n=this.overpoints[i].n;
			this.cls().draw('pie',true);
		} else if(this.overpie.n!==false) {
			this.overpie.n=false;
			this.cls().draw('pie',true);
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
			for(nds=0;nds<nbds;nds++) this.overpoints.push({x:[],y:[],v:[],nds:nds});
			for(nd=0;nd<nbd;nd++) {
				this.drawXLabel(nd,x+(((bw+1)*nbdsv)/2),this.h-1);
				y=this.ry2;
				for(nds=0;nds<nbds;nds++) {
					d=this.dataset[nds];
					
					y0=stack?y:this.ry2;
					y=y0-Math.round(cy*d.val[nd]);
					x1=Math.round(x);
					x2=Math.round(x+bw);
					if(d.val[nd]!==null) {
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
					}
					this.overpoints[nds].x.push(0.5+Math.floor(x+bw/2));
					this.overpoints[nds].y.push(y);
					this.overpoints[nds].v.push(d.val[nd]);
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
		    d,g,i,j,v,l,
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
		this.gc.lineWidth=this.linewidth;
		this.gc.lineJoin=this.linejoin;
		this.overpoints = [];

		while(d=this.dataset[--nds])
			if((l=d.val.length)>1) {
				//console.log("[harry] curve("+d.tit+")"+(river?" river":""));
				//calc
				var x=[],y=[],n1,n2;
				for(i=0;i<l;++i) {
					v=0;
					if(river) for(j=0;j<=nds;j++) v+=this.dataset[j].val[i];
					else v=d.val[i];
					x.push(this.rx+Math.round(i*(this.rw/(l-1))));
					y.push(this.ry2-Math.round(cy*v));
				}
				this.overpoints.push({x:x,y:y,v:this.dataset[nds].val,nds:nds});
				i--;
				x.push(this.rx+Math.round(i*(this.rw/(l-1))));
				y.push(this.ry2-Math.round(cy*v));
				//dont draw leading/ending null values
				n1=0;
				while(d.val[n1]===null) n1++;
				n2=l-1;
				while(d.val[n2]===null) n2--;
				//fill
				if(n1<=n2 && (g=this.getGradient(d.col))) {
					this.gc.beginPath();
					this.gc.moveTo(x[n1],this.ry2);
					this.gc.lineTo(x[n1],y[n1]);
					drawPath(this.gc,x,y,d.val,n1,n2);
					this.gc.lineTo(x[n2],this.ry2);
					this.gc.closePath();
					this.gc.fillStyle=g;
					this.gc.fill();
				}
				//draw lines
				this.gc.strokeStyle=d.col;
				this.gc.beginPath();
				this.gc.moveTo(x[n1],y[n1]);
				drawPath(this.gc,x,y,d.val,n1,n2);
				this.gc.stroke();
				//draw x labels
				if(nds==0)
					for(i=0;i<l;++i)
						this.drawXLabel(i,x[i],this.h);
				//draw points
				if(this.radiuspoint) {
					this.gc.fillStyle=d.col;
					for(i=0;i<l;++i) {
						if(d.val[i]!=undefined){
							this.gc.beginPath();
							this.gc.arc(x[i],y[i],this.radiuspoint,0,2*Math.PI);
							this.gc.closePath();
							this.gc.fill();
						}
					}
				}
			}
		return this;
	},

	lineOver: function(x,y,river,curve) {
		var i,n=false,o,xmin,lw=this.mouseover.linewidth||1;
		if(this.overpoints.length) {
			o=this.overpoints[0];
			for(i=0;i<o.x.length;++i)
				if(o.v[i]!=undefined && (Math.abs(x-o.x[i])<xmin || n===false)) {
					xmin=Math.abs(x-o.x[i]);
					n=i;
				}
			if(n!==false) {
				for(i=0;i<this.overpoints.length;++i) {
					o=this.overpoints[i];
					if(o.v[n]!=undefined) {
						if(this.mouseover.border) {
							this.gc.beginPath();
							this.gc.lineWidth=lw+2;
							this.gc.arc(o.x[n],o.y[n],this.mouseover.radius,0,2*Math.PI);
							if(this.mouseover.linewidth==0) {
								this.gc.fillStyle=this.mouseover.border;
								this.gc.fill();
							} else {
								this.gc.strokeStyle=this.mouseover.border;
								this.gc.stroke();
							}
						}
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
						if(this.mouseover.axis){
							var xy,y,s=2;
							this.gc.lineWidth=1;
							//draw axis
							if(/x/i.test(this.mouseover.axis)){
								y=o.y[n]+this.mouseover.radius;
								while(y<this.ry2){
									this.gc.moveTo(o.x[n],y);
									y+=s;
									if(y>this.ry2) y=this.ry2;
									this.gc.lineTo(o.x[n],y);
									y+=s;
								}
								this.gc.stroke();
							}
							if(/y/i.test(this.mouseover.axis)){
								x=o.x[n]+this.mouseover.radius;
								while(x<this.rx2){
									this.gc.moveTo(x,o.y[n]);
									x+=s;
									if(x>this.rx2) x=this.rx2;
									this.gc.lineTo(x,o.y[n]);
									x+=s;
								}
								this.gc.stroke();
							}
						}
						this.drawBullet(o.x[n],o.y[n],lw/2+1+this.mouseover.radius,o.v[n],n,o.nds,false);
					}
				}
			}
		}
		return this;
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
		var g=false;
		switch(this.getFillMode()) {
		case "s": //solid
			g=harryTools.calcColor(color,0,this.opacity);
			break;
		case "l": //light
			g=harryTools.calcColor(color,0x15,this.opacity);
			break;
		case "d": //dark
			g=harryTools.calcColor(color,-0x15,this.opacity);
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