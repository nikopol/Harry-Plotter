harry plotter 0.5
-----------------
~L~ nikomomo@gmail.com 2009-2012

samples can be viewed [here](http://nikopol.github.com/Harry-Plotter/)
generator can be used [here](http://nikopol.github.com/Harry-Plotter/generator.html)

**reference**

	var h=new harry({ //everything is optional
		datas: [v1,v2,v3,...],        //simple values mono set
		datas: [[v1,v2],[w1,w2],...], //simple values multi set
		datitle: "string" or [..],    //dataset title, if multi set title must
		                              //be an array, default=dataset#$n
		color: "112233" or [..],      //dataset color, if multi set color must 
		                              //be an array, default=a modulo from default 
		                              //harry colors 
		id: "str",                    //canvas's id, by default harry$n
		container: "str/elem",	      //container where to append canvas,default=body
		canvas: "str/elem",           //canvas element, default=create it into container
		width: int,                   //canvas's width, default=container.width or 300
		height: int,                  //canvas's  height, default=container.height or 80
		mode: "pie|chart|line|curve|line:river|curve:river", //draw mode, default=line
		linewidth: int,               //line width, default=1
		linejoin: "round|bevel|miter" //line join, default=miter
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
			                          // default=normal 9px "Sans Serif","Trebuchet MS"
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

**usage**

	h.clear()          //delete all dataset
	 .cls()            //erase canvas
	 .addDataSet(data) //add a dataset, see contructor
	 .draw();          //draw all dataset 
	h.mode='river';    //change current draw mode

**short sample**

	<canvas id="box" height="50" width="100"></canvas>
	<script>new harry({canvas:'box',datas:[1,2,3,4,5]})</script>
