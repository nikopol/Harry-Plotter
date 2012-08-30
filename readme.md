harry plotter 0.5
-----------------
~L~ nikopol 2009-2012

samples can be viewed [here](http://nikopol.github.com/Harry-Plotter/)  
generator can be used [here](http://nikopol.github.com/Harry-Plotter/generator.html)

**constructor**

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

**methods**

	h.clear()           //delete all dataset
	 .cls()             //erase canvas
	 .addDataSet(data)  //add a dataset, see contructor
	 .setMode('chart')  //change current draw mode
	 .draw();           //

**short sample**

	<canvas id="box" height="50" width="100"></canvas>
	<script>
		new harry({
			canvas:'box',
			datas:[1,2,4,8,4,2,1],
			mode:'river',
			fill:'vertical'
		});
	</script>
