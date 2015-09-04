harry plotter 0.9f
------------------
~L~ nikopol 2009-2015

**what's that**

harry is a lightweight standalone javascript library to plot data as charts, pies, donuts, lines or curves.

samples can be viewed [here](http://nikopol.github.com/Harry-Plotter/#tab=presets)  
a generator, that let's you play with all parameters can be used [here](http://nikopol.github.com/Harry-Plotter/#tab=generator)

**prerequisite**

  - browser supporting canvas required (Chrome,Firefox,Opera,Safari,IE9+,iOS)

**key features**

  - mono or multi dataset
  - mouseover support
  - lightweight (15k minified)
  - standalone
  - highly configurable
  - basic animation

**constructor**

	//everything in the constructor is optional
	//if data are provided, the graph is directly drawn

	var h=harry({

		//datas can be provided in these formats :
		
		datas: [v1,v2,v3,...],        //simple dataset values
		datas: {l1:v1,l2:v2,l3:v3,..},//simple dataset labels/values
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

		id: "str",                    //canvas's id, by default "harry"+count++
		container: "str/elem",	      //container where create canvas, default=body
		canvas: "str/elem",           //canvas element, default=create it into container
		width: int,                   //canvas's width, default=canvas or container width
		height: int,                  //canvas's height, default=canvas or container height
		
		//rendering

		background: "rgba(0,0,0,0.5)" //background color, default=transparent
		color: "#rgb",                //allow to specify a color for a simple dataset
		mode: "curve:stack",          //draw mode, can be:
		                              //  pie          cheesecake
		                              //  pie:donut    cheesecake
		                              //  chart        histogram, side by side
		                              //  chart:stack  stacked histograms
		                              //  chart:vertical  vert. histograms
		                              //  chart:stack:vertical  vert. stacked histograms
		                              //  line         lines (default)
		                              //  line:stack   stacked lines
		                              //  curve        curved lines
		                              //  curve:stack  stacked curved lines
		mirror: {x:false,y:false},    //vertical/horizontal mirror rendering
		barspace: int,                //space between bars for mode chart only, default=auto
		linewidth: int,               //line width, default=1
		linejoin: "round",            //line join, can be round|bevel|miter default=miter
		fill: "vertical",             //fill style (only first letter matter), can be:
		                              //  none         without fills
		                              //  solid        uniform fill (default)
		                              //  light        lighten color
		                              //  dark         darken color
		                              //  vertical     vertical gradient fill
		                              //  horizontal   horizontal gradient fill
		                              //  radial       radial gradient fill
		opacity: 0.8,                 //fill opacity, between 0 and 1
		margins:[top,right,bot,left], //margin size (for labels), default=auto
		autoscale: "top+bottom",      //auto round top and/or bottom y scale, default=none
		pointradius: int,             //radius point size in mode line/curve only, default=none
		anim: int,                    //initial animation duration in seconds, default=disabled

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
			x: int,                   //  x axis, display 1/int labels, 1=all..., default=none
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
			layout: 'h'               //  legends layout h(orizontal) or v(ertical) default=v
		},

		grid: {                       //grid options
			color:"#a0a0a0",          //  grid color, default=#a0a0a0
			y: [0,50,100],            //  y axis, numbers are %, default=[0,25,50,75,100]
			x: [0,100]                //  x axis, numbers are %, default=[0,100]
		},

		//interaction

		mouseover: {,                 //set to false to disable mouseover, default=enabled
			sort: true,               //  sort values, default=false
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
			text: "%v",               //  text in the bullet (%v=value %l=label %n=index %t=title)
			text: "%v",               //  text in the bullet
			                          //      %v=value %l=label %n=index %t=title %s=sum
			                          //      %V=abbreviated value %S=abbreviated sum
			text: callback(params)    //  or text can trigger a callback called with an object
			                          //     {v:..., l:..., n:.. ,...} as defined before
			                          //     if it returns a string, it'll be displayed
			header: {                 //  header in the bullet 
				text: "%v",               //  text in the bullet (same var than mouseover.text)
				font: "9px Trebuchet MS", //  bullet header font, default=mouveover.font
				color: "#666",            //  bullet text color, default=mouseover.color
				shadow: "x,y,blur,#col",  //  bullet text shadow, default=none
			}
		}
	});

	//or (same effect)

	var h=plotter({...});


**methods**

	h.clear()             //delete all dataset
	 .load(data)          //add a dataset, see contructor
	 .draw();             //draw all dataset
	 .draw(mode);         //draw all dataset in a specific mode

**short sample**

	<canvas id="box" height="50" width="100"></canvas>
	<script>
		harry({
			canvas:'box',
			datas:[1,2,4,8,4,2,1],
			mode:'curve',
			fill:'vertical'
		});
	</script>

**license**

[MIT](http://github.com/nikopol/Harry-Plotter/blob/master/license)