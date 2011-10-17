// niko's color picker
// based on colpick from Steven Wittens - http://acko.net/dev/colpick

jQuery.fn.colorPicker = function(o) {
	if(!colPick.main) colPick.init(o || {});
	this.each(function(){ 
		colPick.autoColors(this);
		$(this).focus(function(){ colPick.linkTo(this); });
	});
	return this;
};

var colPick={
	RADIUS: 84,
	SQUARE: 100,
	WIDTH: 194,
	HEIGHT: 194,

	sharped: false,
	staticpos: false,
	container: null,
	callback: null,
	main: null,
	wheel: null,
	color: null,
	rgb: null,
	hsl: null,
	pos: null,

	init: function(o) {
		colPick.sharped=o.sharped;
		colPick.staticpos=o.staticpos;
		colPick.container=(o.container) ? $(o.container) : $('<div></div>').appendTo("body");
		colPick.container.html(
'<div class="colpick">'+
	(colPick.staticpos ? '' : '<div class="close"></div>')+
	'<div class="color"></div>'+
	'<div class="wheel"></div>'+
	'<div class="overlay"></div>'+
	'<div class="h-marker marker"></div>'+
	'<div class="sl-marker marker"></div>'+
'</div>'
		);
		colPick.main=$('.colpick',colPick.container);
		colPick.wheel=$('.wheel',colPick.container).get(0);
		// Fix background PNGs in IE6
		if (navigator.appVersion.match(/MSIE [0-6]\./)) {
			$('*', colPick.main).each(function(){
				if(this.currentStyle.backgroundImage!='none'){
					var image=this.currentStyle.backgroundImage;
					image=this.currentStyle.backgroundImage.substring(5, image.length-2);
					$(this).css({
						backgroundImage: 'none',
						filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
					});
				}
			});
		}

		if(!colPick.staticpos) {
			colPick.container.css({ position: 'absolute', display: 'none' });
			$(colPick.main).children('.close').mousedown(function(e){
				e.stopPropagation();
				colPick.unlink();
			});
		}
		$('*', colPick.main).mousedown(colPick.mousedown);
		colPick.setColor('000000');
	},

	autoColors: function(e) {
		var col=colPick.unpack($(e).val());
		if(col) {
			var hsl=colPick.RGBToHSL(col);
			$(e).css({
				backgroundColor: '#'+colPick.pack(col),
				color: hsl[2] > 0.5 ? '#000' : '#fff'
			});
		}
		return this;
	},

	linkTo: function(callback) {
		if (typeof colPick.callback == 'object') $(colPick.callback).unbind('keyup', colPick.updateValue).unbind('scroll');
		colPick.color = null;
		if(typeof callback == 'function') 
			colPick.callback=callback;
		else if(typeof callback=='object' || typeof callback=='string'){
			colPick.callback=$(callback);
			colPick.callback.bind('keyup', colPick.updateValue);
			//todo: capture click mouse outside for autoclose
			if(colPick.callback.val()) colPick.setColor(colPick.callback.val());
			if(!colPick.staticpos) {
				var pos=colPick.callback.offset();
				var x=pos.left, y=pos.top+colPick.callback.outerHeight()+3; //wtf?
				var xmax=$(window).width()+$(document).scrollLeft(), ymax=$(window).height()+$(document).scrollTop();
				if(x+colPick.WIDTH>xmax) {
					colPick.main.addClass('rightdock');
					x=pos.left+colPick.callback.width()-colPick.WIDTH;
				} else 
					colPick.main.removeClass('rightdock');
				if(y+colPick.HEIGHT>ymax) {
					colPick.main.addClass('topdock');
					y=pos.top-colPick.HEIGHT;
				} else
					colPick.main.removeClass('topdock');
				colPick.container.css({ left: x, top: y }).show();
				$(document).bind('mousedown', colPick.checkClick);
			}
		}
		return this;
	},

	unlink: function() {
		if(colPick.staticpos) return;
		$(document).unbind('mousedown', colPick.checkClick);
		colPick.container.hide();
	},

	checkClick: function(e) {
		var pos=colPick.container.offset();
	   var x=e.pageX-pos.left, y=e.pageY-pos.top;
		if(x<0 || y<0 || x>colPick.WIDTH || y>colPick.HEIGHT) colPick.unlink();
	},

	updateValue: function(event) {
		if(this.value) {
			var col=(this.value[0]=='#') ? this.value.substring(1) : this.value;
			if(col!=colPick.color) colPick.setColor(col);
		}
	},

	setColor: function(color) {
		var unpack=colPick.unpack(color);
		var col=(color.length && color[0]=='#') ? color.substring(1) : color;
		if(colPick.color!=col && unpack) {
			colPick.color=col;
			colPick.rgb=unpack;
			colPick.hsl=colPick.RGBToHSL(colPick.rgb);
			colPick.updateDisplay();
		}
		return this;
	},

	setHSL: function(hsl) {
		colPick.hsl=hsl;
		colPick.rgb=colPick.HSLToRGB(hsl);
		colPick.color=colPick.pack(colPick.rgb);
		colPick.updateDisplay();
		return this;
	},

	widgetCoords: function(event) {
		var x, y;
		var el = event.target || event.srcElement;
		var reference = colPick.wheel;

		if (typeof event.offsetX != 'undefined') {
			// Use offset coordinates and find common offsetParent
			var pos = { x: event.offsetX, y: event.offsetY };

			// Send the coordinates upwards through the offsetParent chain.
			var e = el;
			while (e) {
				e.mouseX = pos.x;
				e.mouseY = pos.y;
				pos.x += e.offsetLeft;
				pos.y += e.offsetTop;
				e = e.offsetParent;
			}

			// Look for the coordinates starting from the wheel widget.
			var e = reference;
			var offset = { x: 0, y: 0 }
			while (e) {
				if (typeof e.mouseX != 'undefined') {
					x = e.mouseX - offset.x;
					y = e.mouseY - offset.y;
					break;
				}
				offset.x += e.offsetLeft;
				offset.y += e.offsetTop;
				e = e.offsetParent;
			}

			// Reset stored coordinates
			e = el;
			while (e) {
				e.mouseX = undefined;
				e.mouseY = undefined;
				e = e.offsetParent;
			}

		} else {

			// Use absolute coordinates
			var pos = colPick.absolutePosition(reference);
			x = (event.pageX || 0*(event.clientX + $('html').get(0).scrollLeft)) - pos.x;
			y = (event.pageY || 0*(event.clientY + $('html').get(0).scrollTop)) - pos.y;
		}

		// Subtract distance to middle
		return { x: x - colPick.WIDTH / 2, y: y - colPick.WIDTH / 2 };
	},

	mousedown: function(event) {
		if(event.isPropagationStopped()) return;

		// Capture mouse
		if (!document.dragging) {
			$(document).bind('mousemove', colPick.mousemove).bind('mouseup', colPick.mouseup);
			document.dragging = true;
		}

		// Check which area is being dragged
		var pos = colPick.widgetCoords(event);
		colPick.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) * 2 > colPick.SQUARE;

		// Process
		colPick.mousemove(event);
		return false;
	},

	mousemove: function (event) {
		// Get coordinates relative to color picker center
		var pos = colPick.widgetCoords(event);

		// Set new HSL parameters
		if (colPick.circleDrag) {
			var hue = Math.atan2(pos.x, -pos.y) / 6.28;
			if (hue < 0) hue += 1;
			colPick.setHSL([hue, colPick.hsl[1], colPick.hsl[2]]);
		} else {
			var sat = Math.max(0, Math.min(1, -(pos.x / colPick.SQUARE) + .5));
			var lum = Math.max(0, Math.min(1, -(pos.y / colPick.SQUARE) + .5));
			colPick.setHSL([colPick.hsl[0], sat, lum]);
		}
		return false;
	},

	mouseup: function () {
		// Uncapture mouse
		$(document).unbind('mousemove', colPick.mousemove);
		$(document).unbind('mouseup', colPick.mouseup);
		document.dragging = false;
	},

	updateDisplay: function () {
		// Markers
		var angle = colPick.hsl[0] * 6.28;
		$('.h-marker', colPick.main).css({
			left: Math.round(Math.sin(angle) * colPick.RADIUS + colPick.WIDTH / 2) + 'px',
			top: Math.round(-Math.cos(angle) * colPick.RADIUS + colPick.WIDTH / 2) + 'px'
		});

		$('.sl-marker', colPick.main).css({
			left: Math.round(colPick.SQUARE * (.5 - colPick.hsl[1]) + colPick.WIDTH / 2) + 'px',
			top: Math.round(colPick.SQUARE * (.5 - colPick.hsl[2]) + colPick.WIDTH / 2) + 'px'
		});

		// Saturation/Luminance gradient
		$('.color', colPick.main).css('backgroundColor', '#'+colPick.pack(colPick.HSLToRGB([colPick.hsl[0], 1, 0.5])));

		// Linked elements or callback
		if (typeof colPick.callback == 'object') {
			// Set background/foreground color
			$(colPick.callback).css({
				backgroundColor: '#'+colPick.color,
				color: colPick.hsl[2] > 0.5 ? '#000' : '#fff'
			});

			// Change linked value
			$(colPick.callback).each(function() {
				this.value = (colPick.sharped) ? '#'+colPick.color : colPick.color;
			});

		} else if (typeof colPick.callback == 'function')
			colPick.callback.call(fb, (colPick.sharped) ? '#'+colPick.color : colPick.color);
	},

	absolutePosition: function(el) {
		var r = { x: el.offsetLeft, y: el.offsetTop };
		// Resolve relative to offsetParent
		if (el.offsetParent) {
			var tmp = colPick.absolutePosition(el.offsetParent);
			r.x += tmp.x;
			r.y += tmp.y;
		}
		return r;
	},

	/* Various color utility functions */
	pack: function(rgb) {
		var r = Math.round(rgb[0] * 255);
		var g = Math.round(rgb[1] * 255);
		var b = Math.round(rgb[2] * 255);
		return (r < 16 ? '0' : '') + r.toString(16) +
			(g < 16 ? '0' : '') + g.toString(16) +
			(b < 16 ? '0' : '') + b.toString(16);
	},

	unpack: function(color) {
		if(!color.length) return;
		var d=(color[0]=='#') ? 0 : 1;
		if (color.length == 7-d) {
			return [
				parseInt('0x' + color.substring(1-d, 3-d)) / 255,
				parseInt('0x' + color.substring(3-d, 5-d)) / 255,
				parseInt('0x' + color.substring(5-d, 7-d)) / 255
			];
		} else if (color.length == 4-d) {
			return [
				parseInt('0x' + color.substring(1-d, 2-d)) / 15,
				parseInt('0x' + color.substring(2-d, 3-d)) / 15,
				parseInt('0x' + color.substring(3-d, 4-d)) / 15
			];
		}
	},

	HSLToRGB: function(hsl) {
		var m1, m2, r, g, b;
		var h = hsl[0], s = hsl[1], l = hsl[2];
		m2 = (l <= 0.5) ? l * (s + 1) : l + s - l*s;
		m1 = l * 2 - m2;
		return [
			colPick.hueToRGB(m1, m2, h+0.33333),
			colPick.hueToRGB(m1, m2, h),
			colPick.hueToRGB(m1, m2, h-0.33333)
		];
	},

	hueToRGB: function(m1, m2, h) {
		h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
		if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
		if (h * 2 < 1) return m2;
		if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
		return m1;
	},

	RGBToHSL: function(rgb) {
		var min, max, delta, h, s, l;
		var r = rgb[0], g = rgb[1], b = rgb[2];
		min = Math.min(r, Math.min(g, b));
		max = Math.max(r, Math.max(g, b));
		delta = max - min;
		l = (min + max) / 2;
		s = 0;
		if (l > 0 && l < 1) s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
		h = 0;
		if (delta > 0) {
			if (max == r && max != g) h += (g - b) / delta;
			if (max == g && max != b) h += (2 + (b - r) / delta);
			if (max == b && max != r) h += (4 + (r - g) / delta);
			h /= 6;
		}
		return [h, s, l];
	}
};

