{
	"Lines & Curves": {
		"Simple Lines": {
			"datas": [
				{"title":"joker","values":[59,21,30,86,5,75,24,92,80,11,22,83,19,91,99,74]},
				{"title":"batman","values":[51,52,47,6,5,86,95,93,96,22,55,49,21,21,6,49]}
			],
			"labels":{"color":"#fff","ypos":"left","x":3,"y":[50,100],"marks":2},
			"mode":"line",
			"fill":"none",
			"opacity":0.5,
			"linewidth":3, 
			"background":"#666",
			"autoscale":"top",
			"grid":{"x":"0","y":"0"},
			"mouseover":{"radius":4,"linewidth":2,"circle":"#fff","bullet":"#444","shadowbox":"1,1,0,#000","axis":"x"},
			"legends":{"color":"#fff","shadow":"1,1,0,#000"}
		},
		"Curve River - Dark": {
			"datas": [
				{"values":[51,52,47,6,5,86,95,93,96,22,55,49,21,21,6,49],"color":"#fc0"},
				{"values":[59,21,30,86,5,75,24,92,80,11,22,83,19,91,99,74],"color":"#0cf"},
				{"values":[58,0,5,40,82,37,37,77,92,76,38,47,98,43,38,42]}
			],
			"labels":{"x":1,"y":[0,50,100],"color":"#ddd","ypos":"right"},
			"mode":"curve:river",
			"fill":"solid",
			"linewidth":3,
			"autoscale":"top",
			"mouseover":{"radius":4,"linewidth":0,"circle":"#fff"},
			"legends":{"background":"#444","color":"#fff","border":"#fff"},
			"bg":"black"
		}
	},
	"Pies": {
		"Simple Pie": {
			"datas": [
				{"title":"yellow","color":"#fc0","values":[51,52,47,6,5,86,95,93,96,22,55,49,21,21,6,49]},
				{"title":"blue","color":"#0cf","values":[59,21,30,86,5,75,24,92,80,11,22,83,19,91,99,74]},
				{"title":"green","color":"#0f8","values":[58,0,5,40,82,4,37,8,92,1,38,0,98,1,3,3]}
			],
			"mode":"pie",
			"margins":[20,20,20,100],
			"mouseover":{"text":"%t: %p"},
			"legends":{"x":2,"y":2,"font":"normal 12px \"Sans Serif\""},
			"labels":{"x":1,"color":"#444"},
			"bg":"white"
		}
	},
	"Charts": {
		"Simple Chart": {
			"datas": [
				{"title":"in","color":"#393","values":{"May 12":20,"May 13":32,"May 14":55,"May 15":11,"May 16":18}},
				{"title":"out","color":"#933","values":{"May 12":14,"May 13":21,"May 14":66,"May 15":33,"May 16":15}}
			],
			"labels":{"color":"#666","x":1,"y":[0,50,100]},
			"mode":"chart",
			"fill":"vertical",
			"autoscale":"top",
			"legends":{"color":"#","border":"#fff"},
			"bg":"white"
		}
	}
}