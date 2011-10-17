// harry plotter 0.4
// ~L~ nikomomo@gmail.com 2011
// http://alibabar.org/harry

/*

//----- reference

var h=new harry({ //everything is optional
	datas: [v1,v2,v3,...],        //simple values mono set
	datas: [[v1,v2],[w1,w2],...], //simple values multi set
	datitle: "string" or [..],    //dataset title, if multi set title must be an array, default=dataset#$n
	color: "112233" or [..],      //dataset color, if multi set color must be an array, 
	                              //default=a modulo from default harry colors 
	id: "str",                    //canvas's id, by default harry$n
	container: "str/elem",	      //container where to append canvas, default=body
	canvas: "str/elem",           //canvas element, default=create it into container
	width: int,                   //canvas's width, default=container.width or 300
	height: int,                  //canvas's  height, default=container.height or 80
	mode: "pie|chart|line|curve|line:river|curve:river", //draw mode, default=line
	linewidth: int,               //line width, default=1
	linejoin: "round|bevel|miter" //line join, default=round
	fill: "none|auto|solid|vertical|horizontal|radial", //fill style (only first letter matter), default=auto
	opacity: 0.8,                 //fill opacity, between 0 and 1, override if fill=auto
	title: {                      //title options
		font: "9px Trebuchet MS", //font size & family, default=bold 12px "Sans Serif"
		color: "rgba(4,4,4,0.3)", //font color, default=rgba(4,4,4,0.3)
		text: "title"             //clear enough
		x: 5,                     //title position x
		y: 10                     //title position y
	},
	labels: {                     //labels options
		font: "9px Trebuchet MS", //font size & family, important:use px size,
		                          //default=normal 9px "Sans Serif","Trebuchet MS"
		color: "#a0a0a0",         //font color, default=a0a0a0
		y: [0,50,100,"max|min|avg"]//y legend, numbers are %, default=none
		x: ['label 1','label 2',etc]//'all' display data index, or array of labels
		stepx: 1                  //draw each stepx
	},                            //  step indicate step between labels (2 print one label on two), default=none
	grid: {                       //grid options
		color:"#a0a0a0",          //grid color, default=#a0a0a0
		y: [0,50,100]             //y legend, number are %, default=[0,25,50,75,100]
		x: [0,100]                //x legend, number are %, default=[0,100]
	},
	margins:[top,right,bot.,left] //margin size (for labels), default=auto
});

h.clear()          //delete all dataset
 .cls()            //erase canvas
 .addDataSet(data) //add a dataset, see contructor
 .draw();          //draw all dataset 
h.mode='river';    //change current draw mode

//----- short sample

<canvas id="box" height="50" width="100"></canvas>
<script>new harry({canvas:'box',datas:[1,2,3,4,5]})</script>

*/

if(log==undefined) {
	var log=function(){};
	if(/jsdebug/i.test(document.location.href)) {
		if(window.console) log=function(m){window.console.log(m)};
		else if(console)   log=function(m){console.log(m)};
	}
}

var plotter=function(d){new harry(d)};

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
	}
};

var harry=function(o) {
	this.clear();
	if(o.canvas) {
		this.canvas=document.getElementById(o.canvas);
	} else {
		this.canvas=document.createElement('canvas');
		if(o.id) this.canvas.setAttribute('id',o.id);
		document.getElementById(o.container||'body').appendChild(this.canvas);
		this.canvas.setAttribute('width',(o.width||300)+'px');
		this.canvas.setAttribute('height',(o.height||150)+'px');
	}
	this.w=this.canvas.width;
	this.h=this.canvas.height;
	this.id=o.id || "harry"+(++harryTools.count);
	this.mode=o.mode || "line";
	this.fill=(o.fill || "auto")[0].toLowerCase().replace(/[^nasvhr]/,"a");
	this.opacity=(o.opacity || 1);
	this.linewidth=o.linewidth || 1;
	this.linejoin=o.linejoin || "round";
	this.labels=o.labels || {};
	this.labels.color=this.labels.color || "#a0a0a0";
	this.labels.font=this.labels.font || 'normal 9px "Sans Serif","Trebuchet MS"';
	this.labels.fontpx=harryTools.fontPixSize(this.labels.font);
	this.labels.stepx=this.labels.stepx||1;
	this.margins=o.margins || [0,0,0,0];
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
	log("[harry] init("+this.w+","+this.h+")");
	if(o.datas) {
		if(typeof o.datas[0]=="object") for(var i=0,l=o.datas.length;i<l;++i) this.addDataSet(o.datas[i],o.title?o.title[i]:false,o.color?o.color[i]:false);
		else this.addDataSet(o.datas,o.datitle,o.color);
	}
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
		log('[harry] clear');
		this.dataset=[];
		this.dmin=0xffffffff;
		this.dmax=0;
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
			this.dmax=datas.max;
			this.dsum=datas.max;
			t=datas.tit;
		} else {
			this.dmin=Math.min(datas.min,this.dmin);
			this.dmax=Math.max(datas.max,this.dmax);
			this.dsum+=datas.max;
			var st=[];
			for(var i=0;i<this.dlen;++i) st.push(this.dataset[i].tit);
			t=st.join(",\r ");
		}
		t+="\r [Mode "+this.mode+"]";
		this.canvas.setAttribute('title',t);
		log("[harry] addDataSet "+datas.tit+"=("+datas.val.join(",")+") len="+this.dlen+" sum="+this.dsum);
		return this;
	},
	
	draw: function(mode) {
		this.mode=(mode || this.mode).toLowerCase();
		log("[harry] draw("+this.mode+")");
		var args=this.mode.split(/:/);
		this.drawGrid().drawYLabels()[args[0]](args.length==1?false:args[1]).drawTitle();
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
			log("[harry] grid x("+this.grid.x.join(",")+") y("+this.grid.y.join(",")+")"); 
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
			log("[harry] labels y("+this.labels.y.join(",")+") "+this.labels.font);
			if(/chart|line|curve/.test(this.mode)) {
				var max=/\:r/.test(this.mode)?this.dsum:this.dmax;
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
	
	pie: function() {
		var nbds=this.dlen;
		log("[harry] pie ("+nbds+" dataset)");
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
	
	chart: function() {
		var nbds=this.dlen;
		log("[harry] chart ("+nbds+" dataset)");
		if(nbds){
			var nd,nds,nbd=this.dataset[0].len,m=nbds>1?4:0;
			var bw=(nbd && nbds)?(((this.rw-(m*(nbd-1)))/nbd)/nbds)-1:0;
			if(bw<0) bw=0;
			var d,g,y,x=this.rx,x1,x2,cy=(this.dmax)?this.rh/this.dmax:0;
			this.gc.lineWidth=this.linewidth;
			this.gc.lineJoin="miter";
			for(nd=0;nd<nbd;nd++) {
				this.drawXLabel(nd,x+(((bw+1)*nbds)/2),this.h-1);
				for(nds=0;nds<nbds;nds++) {
					d=this.dataset[nds];
					y=this.ry2-Math.round(cy*d.val[nd]);
					x1=Math.round(x);
					x2=Math.round(x+bw);
					this.gc.beginPath();
					this.gc.moveTo(x1,this.ry2);
					this.gc.lineTo(x1,y);
					this.gc.lineTo(x2,y);
					this.gc.lineTo(x2,this.ry2);
					this.gc.closePath();
					if(g=this.getGradient(d.col)){
						this.gc.fillStyle=g;
						this.gc.fill();
					}
					this.gc.strokeStyle=d.col;
					this.gc.stroke();
					x+=bw+1;
				}
				x+=m;
			}
		}
		return this;
	},
	
	curve: function(river) {
		return this.line(river,true);
	},

	line: function(river,curve) {
		var nds=this.dlen,cy=river?(this.dsum?this.rh/this.dsum:0):(this.dmax?this.rh/this.dmax:0),
		    d,g,i,j,v,l;
		this.gc.lineWidth=this.linewidth;
		this.gc.lineJoin=this.linejoin;
		while(d=this.dataset[--nds])
			if((l=d.val.length)>1) {
				log("[harry] curve("+d.tit+")"+(river?" river":""));
				//calc
				var px,py,lx,ly,x=[],y=[];
				for(i=0;i<l;++i) {
					v=0;
					if(river) for(j=0;j<=nds;j++) v+=this.dataset[j].val[i];
					else v=d.val[i];
					x.push(this.rx+Math.round(i*(this.rw/(l-1))));
					y.push(this.ry2-Math.round(cy*v));
				}
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
						for(i=1;i<=l;++i)
							this.gc.lineTo(x[i-1],y[i-1]);
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
			}
		return this;
	},

	getFillMode: function() {
		if(this.fill=="a") {
			this.opacity=1;
			if(/\:river/.test(this.mode)) return "v";
			if(/line/.test(this.mode)) return this.dlen>1?"n":"v";
			if(/curve/.test(this.mode)) return this.dlen>1?"n":"v";
			if(/chart/.test(this.mode)) return this.dlen>1?"s":"v";
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

