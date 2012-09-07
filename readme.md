harry plotter 0.8
-----------------
~L~ nikopol 2009-2012

**what's that**

harry is a lightweight standalone javascript library to plot data as charts, pies, lines or curves.

samples can be viewed [here](http://nikopol.github.com/Harry-Plotter/)  
generator can be used [here](http://nikopol.github.com/Harry-Plotter/generator.html)

**prerequisite**

  - browser supporting canvas required (Chrome,Firefox,Opera,Safari,IE9)

**key features**

  - mono or multi dataset
  - mouseover support
  - lightweight
  - standalone
  - fully configurable

**constructor**

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


**methods**

	h.clear()             //delete all dataset
	 .load(data)          //add a dataset, see contructor
	 .draw();             //draw all dataset
	h.canvas.onclick=function(){
		h.draw('river');  //redraw
	};

**short sample**

	<canvas id="box" height="50" width="100"></canvas>
	<script>
		harry({
			canvas:'box',
			datas:[1,2,4,8,4,2,1],
			mode:'river',
			fill:'vertical'
		});
	</script>
