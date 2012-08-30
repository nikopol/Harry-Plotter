harry plotter 0.5
-----------------
~L~ nikomomo@gmail.com 2009-2012

samples can be viewed [here](http://nikopol.github.com/Harry-Plotter/)
generator can be used [here](http://nikopol.github.com/Harry-Plotter/generator.html)

**constructors**

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
		container: "str/elem",	      //container where create canvas, default=body
		canvas: "str/elem",           //canvas element, default=create it into container
		width: int,                   //canvas's width, default=container.width or 300
		height: int,                  //canvas's height, default=container.height or 80
		mode: "pie|chart|chart:stack|line|line:river|curve|curve:river",
		                              //draw mode, default=line
		linewidth: int,               //line width, default=1
		linejoin: "round|bevel|miter" //line join, default=miter
		fill: "none|auto|solid|vertical|horizontal|radial", 
		                              //fill style (only first letter matter), default=auto
		opacity: 0.8,                 //fill opacity, between 0 and 1, overrided if fill=auto
		title: {                      //title options
			font:'9px "Trebuchet MS"',//  font size & family, default=normal 9px "Sans Serif"
			color: "rgba(4,4,4,0.3)", //  font color, default=rgba(4,4,4,0.3)
			text: "title"             //  clear enough
			x: 5,                     //  title position x
			y: 10                     //  title position y
			z: "top|background|bg"    //  behind or on top of the graph, default=top
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
			text: "%l\n%v" | cb(n,v)  //  text in the bullet %v=value %l=label %n=index
			                          //    or a callback(n=value index,v=value)
			                          //    default="%v"
		}
	});

	//or (same effects)

	var h=plotter({...});

**usage**

	h.clear()          //delete all dataset
	 .cls()            //erase canvas
	 .addDataSet(data) //add a dataset, see contructor
	 .draw();          //draw all dataset 
	h.mode='river';    //change current draw mode

**short sample**

	<canvas id="box" height="50" width="100"></canvas>
	<script>new harry({canvas:'box',datas:[1,2,3,4,5]})</script>
