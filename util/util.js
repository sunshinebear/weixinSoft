function EventEmitter(){
  this.events={};
}

EventEmitter.prototype.on = function(name,cb){
  if(!this.events[name])
    this.events[name] =[];
  this.events[name].push(cb);
}

EventEmitter.prototype.emit = function(name){
  let _args = [].slice.call(arguments);
  _args.splice(0,1);
  if(this.events[name] instanceof Array){
      this.events[name].forEach(item=>{
          item(_args);
      });
  }
}

EventEmitter.prototype.remove = function(name,cb){
  if(this.events[name] instanceof Array){
    var _index = this.events[name].indexOf(cb);
    this.events[name].splice(_index,1);
  }
}


let Util = {
  event:EventEmitter
}

function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  Util:Util
}
