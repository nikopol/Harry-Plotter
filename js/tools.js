// TOOLS 1.0 
// GENERAL PURPOSE LIBRAY
// niko@rtgi.fr 08-09

/*array*/
if(Array.remove==undefined)
	Array.prototype.remove=function(from,to) {
		this.splice(from, !to || 1+to-from+(!(to<0 ^ from>=0) && (to<0 || -1)*this.length));
		return this.length;
	};

/*string*/
if(String.trim==undefined) String.prototype.trim=function() { return this.replace(/^\s+|\s+$/g, ""); };
if(String.capitalize==undefined) String.prototype.capitalize=function() { return this[0].toUpperCase()+this.substr(1); };
if(String.trunc==undefined) String.prototype.trunc=function(max,sufix) { return this.length>max?this.substr(0,max)+(sufix||"..."):this; }
if(String.midtrunc==undefined) String.prototype.midtrunc=function(max,inter) { var l=Math.floor(max/2),r=this.length-max+l;return this.length>max?this.substr(0,l)+(inter||"...")+this.substr(r):this; }
if(String.urlencode==undefined) String.prototype.urlencode=function() { 
	return this
		.replace(/\%/g,         "%25")
		.replace(/\t/g,         "%09")
		.replace(/\\/g,         "%22")
		.replace(/#/,           "%23")
		.replace(/\&|\&amp\;/gi,"%26")
		.replace(/\'|\&\#39\;/g,"%27")
		.replace(/\//g,         "%2F")
		.replace(/=/g,          "%3D")
		.replace(/\?/g,         "%3F")
		.replace(/\\/g,         "%5C")
	;
};

/*jquery*/
if(jQuery.fn.check==undefined)
	jQuery.fn.check=function(b){
		if(b==undefined) {
			var nb=0;
			this.each(function(){ if(this.checked) nb++; });
			return nb==this.length;
		}
		return this.each(function(){ this.checked=b; });
   };

/* JQUERY COLOR ANIMATION PLUGIN
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */
(function(jQuery){
	// We override the animation for all of these color styles
	jQuery.each(['backgroundColor','borderBottomColor','borderLeftColor','borderRightColor','borderTopColor','color','outlineColor'],function(i,attr){
		jQuery.fx.step[attr]=function(fx){
			if(fx.state==0) {
				fx.start=getColor(fx.elem,attr);
				fx.end=getRGB(fx.end);
			}
			fx.elem.style[attr]="rgb("+[
				Math.max(Math.min(parseInt((fx.pos*(fx.end[0]-fx.start[0]))+fx.start[0]),255),0),
				Math.max(Math.min(parseInt((fx.pos*(fx.end[1]-fx.start[1]))+fx.start[1]),255),0),
				Math.max(Math.min(parseInt((fx.pos*(fx.end[2]-fx.start[2]))+fx.start[2]),255),0)
			].join(",")+")";
		}
	});
	// Color Conversion functions from highlightFade
	// By Blair Mitchelmore http://jquery.offput.ca/highlightFade/
	// Parse strings looking for color tuples [255,255,255]
	function getRGB(color) {
		var result;
		if(color && color.constructor==Array && color.length==3) return color;
		if(result=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];
		if(result=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color)) return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];
		if(result=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)) return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];
		if(result=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color)) return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];
		return [0,0,0];
	};
	function getColor(elem, attr) {
		var color;
		do {
			color=jQuery.curCSS(elem, attr);
			if(color!='' && color!='transparent' || jQuery.nodeName(elem,"body")) break;
			attr="backgroundColor";
		} while(elem=elem.parentNode);
		return getRGB(color);
	};
})(jQuery);


/* COOKIE PLUGIN
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

jQuery.cookie=function(name,value,options){
if(typeof value!='undefined'){
	options=options||{};
	if(value===null){value='';options.expires=-1;}
	var expires='',date;
	if(options.expires&&(typeof options.expires=='number'||options.expires.toUTCString)){
		if(typeof options.expires=='number'){date=new Date();date.setTime(date.getTime()+(options.expires*24*60*60*1000));}
		else date=options.expires;
		expires='; expires='+date.toUTCString();
	}
	var path=options.path?'; path='+(options.path):'',domain=options.domain?'; domain='+(options.domain):'',secure=options.secure?'; secure':'';
	document.cookie=[name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');
}else{
	var v=null;
	if(document.cookie&&document.cookie!=''){
		var cookies=document.cookie.split(';');
		for(var i=0;i<cookies.length;i++){
			var cookie=jQuery.trim(cookies[i]);
			if(cookie.substring(0,name.length+1)==(name+'=')){
				v=decodeURIComponent(cookie.substring(name.length+1));
				break;
			}
		}
	}
	return v;
}};

/* AUTOGROW (TEXTAREA) PLUGIN
 * based on autogrow by Chrys Bader (www.chrysbader.com)
 * chrysb@gmail.com
 * Copyright (c) 2008 Chrys Bader (www.chrysbader.com)
 * Licensed under the GPL (GPL-LICENSE.txt) license. 
 */
 
(function(jQuery){
	var self = null;
	jQuery.fn.autoHeight=function(o,min,max){ 
		var resized=false;
		this.each(
			function(){
				var o=$(this), sh=this.scrollHeight, h=o.height();
				if(sh>h && (!max || sh<max)){
					o.height(sh);
					resized=true;
				} else if(min && h>min && o.val().length==0){
					o.height(min);
					resized=true;
				}
			}
		);
		if(resized) $(window).trigger('resize');
		return this;
	};
	jQuery.fn.autogrow=function(o){ return this.each(function(){new jQuery.autogrow(this, o);});	};
	jQuery.autogrow=function(e,o){
		this.options=o || {};
		this.textarea=jQuery(e);
		this.init();
	};
	jQuery.autogrow.fn=jQuery.autogrow.prototype={ autogrow: '1.0.0' };
	jQuery.autogrow.fn.extend=jQuery.autogrow.extend=jQuery.extend;
	jQuery.autogrow.fn.extend({
		init: function(){
			var self=this;
			this.hbase=this.options.min || this.textarea.height();
			this.textarea/*.unbind('keyup')*/.bind('keyup',function(){ self.textarea.autoHeight(self.hbase,self.options.max); });
			self.textarea.autoHeight(this.hbase,this.options.max);
		}
	});
})(jQuery);

/* STATIC FLASH BUILDER - niko */

var flasher={
	build: function(file,vars,options,params) {
		vars=vars || {};
		options=options || {};
		params=params || {};
		//default options
		var h=options.height || "100%";
		var w=options.width || "100%";
		var id=options.id || "flashid";
		//default params
		if(vars) params['FlashVars']=vars; //file+="?"+vars;
		if(!params['allowScriptAccess']) params['allowScriptAccess']="sameDomain";
		if(!params['allowFullScreen']) params['allowFullScreen']="true";
		if(!params['bgcolor']) params['bgcolor']="#ffffff";
		if(!params['align']) params['align']="middle";
		if(!params['quality']) params['quality']="high";
		var f='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+w+'" height="'+h+'" id="'+id+'" align="'+params['align']+'">';
		f+='<param name="movie" value="'+file+'" />';
		for(var p in params) f+='<param name="'+p+'" value="'+params[p]+'" />';
		f+='<embed src="'+file+'" name="'+id+'" width="'+w+'" height="'+h+'" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"';
		for(var p in params) f+=' '+p+'="'+params[p]+'"';
		f+=' /></object>';
		return f;
	}
}

/* STATIC ANCHOR TOOLS - niko */

var anchor={
	serialize: function(dta) { return encodeURIComponent((dta.constructor==Array) ? arr.join(";") : dta); },
	unserialize: function(str) { return decodeURIComponent(str).split(";"); },
	put: function(arr) { document.location="#"+anchor.serialize(arr); },
	get: function() { 
		var p=document.location.href.indexOf('#');
		return (p!=-1) ? arr=anchor.unserialize(document.location.href.substr(p+1)) : [];
	}
};

/* JSON TOOLS - niko */

var json={
	encode: function(o,jsquote) { /*ignore functions*/
		jsquote=jsquote||false;
		var lines=[], isarray=(o.constructor==Array),k,v,s;
		for(k in o) {
			v=o[k];
			if(typeof v=="object") {
				if(isarray) lines.push(json.encode(v,jsquote));
				else lines.push((jsquote?k:'"'+k+'"')+':'+json.encode(v,jsquote));
			} else if(typeof v!="function") {
				s=(isarray)?"":(jsquote?k+':':'"'+k+'":');
				if(typeof v=="number") s+=v.toString(10);
				else if(v===false) s+='false';
				else if(v===true) s+='true';
				else s+='"'+(v || "").replace(/"/g,"\\\"").replace(/\n|\r/g,' ')+'"';
				lines.push(s);
			}
		}
		return (isarray) ? "["+lines.join(",")+"]" : "{"+lines.join(",")+"}";
	},
	tidy: function(txt) {
		txt=txt.replace(/\n|\r|\t/gi,"").replace(/^\s+/g,'');
		var l=txt.length,n=0,c,nc,i=0,fmt="",iq=false,newline=function(i){ return "\n"+("                                   ".substr(0,i*3)); };
		while(n<l) {
			c=txt[n++];
			nc=(n<l) ? txt[n] : '';
			if(c=='"') { fmt+=c; iq=!iq; } 
			else if(iq) fmt+=c;
			else if(/\{|\[/.test(c)) fmt+=c+newline(++i);
			else if(/\,/.test(c)) fmt+=c+newline(i);
			else if(/\}|\]/.test(c)) fmt+=newline(--i)+c;
			else fmt+=c;
		}
		return fmt;
	}
}

/* HOTKEYS - niko */

var hotkeys={
	listening:false,
	KEYS: {
  		ESC:27, TAB:9, SPACE:32, RETURN:13, BACKSPACE:8, BS:8, SCROLL:145, CAPSLOCK:20, NUMLOCK:144, PAUSE:19, 
		INSERT:45, DEL:46, HOME:36, END:35, PAGEUP:33, PAGEDOWN:34, LEFT:37, UP:38, RIGHT:39, DOWN:40,
		F1:112, F2:113, F3:114, F4:115, F5:116, F6:117, F7:118, F8:119, F9:120, F10:121, F11:122, F12:123,
	},
	MASKEYS: { ALT:1,CONTROL:2,CTRL:2,SHIFT:4 },
	list:[],
	add: function(key,fn,stop) { 
		log('[hotkeys] add '+key);
		var mask=0;
		if(typeof key=="string") {
			var i,lst=key.toUpperCase().split('+');
			key=0;
			for(mask=0,i=0;i<lst.length;++i) {
				if(hotkeys.MASKEYS[lst[i]]) mask|=hotkeys.MASKEYS[lst[i]];
				else if(hotkeys.KEYS[lst[i]]) key=hotkeys.KEYS[lst[i]];
				else key=lst[i][0];
			}
		}
		if(key) {
			hotkeys.list.push({key:key,fn:fn,stop:stop||false,mask:mask||0}); 
			if(!hotkeys.listening) {
				$(document).keydown(hotkeys.keydown);
				hotkeys.listening=true;
			}
		} else
			log('[hotkeys] ignored');
		return hotkeys;
	},
	del: function(key) {/*todo*/ return hotkeys; },
	keydown: function(e) {
		var k,i=0,l=hotkeys.list.length,chr=String.fromCharCode(e.which).toUpperCase();
		var msk=e.shiftKey*hotkeys.MASKEYS.SHIFT|e.ctrlKey*hotkeys.MASKEYS.CTRL|e.altKey*hotkeys.MASKEYS.ALT;
		for(;i<l;i++) {
			k=hotkeys.list[i];
			if((e.which==k.key || chr==k.key) && msk==k.mask) {
				k.fn(e);
				if(k.stop) {
					e.stopPropagation();
					e.preventDefault();
					return false;
				}
			}
		}
		return true;
	}
}

/* STATIC TABS TOOLS - niko */

var tab={
	active: function(tab) {
		$(tab).parent().children().removeClass('active');
		$(tab).addClass('active');
	}
};

/* LOG - niko */

var log=(/jsdebug/i.test(document.location.href))?
	function(msg){ if(window.console) console.debug(msg); else if(show) show.info(msg); }:
	function(){}
;
