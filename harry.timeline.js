// harry plotter timeline serie generator - 0.4
// ~L~ nikomomo@gmail.com 2012-2015
// https://github.com/nikopol/Harry-Plotter

/*
require: harry.js (sic!)

generate date/time data series for harry.

method:

    harry.timeline.year(data,fnparse,fnfmt)
    harry.timeline.month(data,fnparse,fnfmt)
    harry.timeline.day(data,fnparse,fnfmt)
    harry.timeline.hour(data,fnparse,fnfmt)
    harry.timeline.minute(data,fnparse,fnfmt)
    harry.timeline.second(data,fnparse,fnfmt)

params:

       data: data in form { date1: value, dateX: value, .... }
    fnparse: a function for parsing data's date
             param provided is a string with the date to parse
             default: function(d){ return new Date(d) }
      fnfmt: a function to format displayed dates
             param provided is a Date object
             default depends on method
             eg: function(d){ return new Date(d) }

usage:

var dt = {
    '2012-05-12': 42,
    '2012-06-28': 12,
    '2012-09-05': 65
};

plotter({ datas: harry.timeline.month(dt) });

*/

harry.timeline = (function(){
   "use strict";
   var
   parse = function(d){
      if(/^(\d{4})\D(\d{2})\D(\d{2})(?:\D(\d{2}))?(?:\D(\d{2}))?(?:\D(\d{2}))?/.test(d) )
         return new Date(Date.UTC(RegExp.$1,RegExp.$2-1,RegExp.$3,RegExp.$4||0,RegExp.$5||0,RegExp.$6||0));
      console.error("unable to parse date ",d," please setup a parser");
      return null;
   },
   formats = {
      year: function(d){ return d.getFullYear() },
      month: function(d){ return d.toISOString().substr(0,7) },
      day: function(d){ return d.getDate() },
      hour: function(d){ return d.getHours()+'h' },
      minute: function(d){ return d.toTimeString().substr(0,5) },
      second: function(d){ return d.toTimeString().substr(0,8) }
   },
   intervals = {
      year: {
         eval: function(d){ return d.getFullYear() },
         next: function(e){ return e+1 },
         date: function(e){ return new Date(e+"-01-01T00:00:00Z") }
      },
      month: {
         eval: function(d){ return (new Date(Date.UTC(d.getFullYear(),d.getMonth(),1))).toISOString() },
         next: function(e){
            var y=parseInt(e.substr(0,4),10), m=parseInt(e.substr(5,2),10)+1;
            if(m>12) { y++; m=1; }
            return (new Date(Date.UTC(y,m-1,1))).toISOString()
         },
         date: function(e){
            var y=parseInt(e.substr(0,4),10), m=parseInt(e.substr(5,2),10);
            return new Date(Date.UTC(y,m-1,1));
         }
      },
      day: {
         eval: function(d){ return Math.floor(d.getTime()/86400000) },
         next: function(e){ return e+1 },
         date: function(e){ return new Date(e*86400000) }
      },
      hour: {
         eval: function(d){ return Math.floor(d.getTime()/3600000) },
         next: function(e){ return e+1 },
         date: function(e){ return new Date(e*3600000) }
      },
      minute: {
         eval: function(d){ return Math.floor(d.getTime()/60000) },
         next: function(e){ return e+1 },
         date: function(e){ return new Date(e*60000) }
      },
      second: {
         eval: function(d){ return Math.floor(d.getTime()/1000) },
         next: function(e){ return e+1 },
         date: function(e){ return new Date(e*1000) }
      }
   },
   build = function(series,iter,fnparse,fnfmt){
      var min=null,max=null,r=[],ds=[],da=[],labs=[],nlabs={},ns,nl,nm,d,n,k;
      if(!(series instanceof Array)) series=[series];
      //norm+min&max
      for(ns in series){
         var s={}, src=series[ns];
         if(src.datas) src=src.datas;
         for(k in src){
            d=fnparse(k);
            n=iter.eval(d);
            if(min===null || n<min) min=n;
            if(max===null || n>max) max=n;
            var v=parseFloat(src[k]);
            if(s[n]) s[n]+=v;
            else s[n]=v;
         }
         ds.push(s);
         da.push(
            series[ns].datas
               ? {title:series[ns].title, color:series[ns].color}
               : {title:false, color:false}
         )
      }
      //init
      for(nl in ds) {
         var o={ values: [] };
         if(da[nl].title) o.title=da[nl].title;
         if(da[nl].color) o.color=da[nl].color;
         if(nl==0)
            for(n=min,nm=0;n<=max;n=iter.next(n),nm++) {
               labs.push(fnfmt(iter.date(n)));
               nlabs[n]=nm;
            }
         for(n=min;n<=max;n=iter.next(n)) o.values.push(null);
         o.labels=labs;
         r.push(o);
      }
      //fill
      for(ns in ds)
         for(n in ds[ns]){
            nl=nlabs[n];
            r[ns].values[nl]=ds[ns][n];
         }
      return r;
   };
   return {
      year:  function(s,fnparse,fnfmt){ return build(s, intervals.year,  fnparse||parse, fnfmt||formats.year) },
      month: function(s,fnparse,fnfmt){ return build(s, intervals.month, fnparse||parse, fnfmt||formats.month) },
      day:   function(s,fnparse,fnfmt){ return build(s, intervals.day,   fnparse||parse, fnfmt||formats.day) },
      hour:  function(s,fnparse,fnfmt){ return build(s, intervals.hour,  fnparse||parse, fnfmt||formats.hour) },
      minute:function(s,fnparse,fnfmt){ return build(s, intervals.minute,fnparse||parse, fnfmt||formats.minute) },
      second:function(s,fnparse,fnfmt){ return build(s, intervals.second,fnparse||parse, fnfmt||formats.second) }
   };
})();