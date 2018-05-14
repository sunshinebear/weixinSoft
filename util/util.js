(function (win) {
    var doc = win.document;
    win.$ = function (str) {
        return doc.querySelector(str);
    };
    win.Util = {
        css: function (_ele, _name, value) {
            if (arguments.length == 2 && _name) {
                return _ele.style[_name] || doc.defaultView.getComputedStyle(_ele, null)[_name];
            }
            else if (arguments.length == 3 && value)
                _ele.style[_name] = value;
        },
        addClass: function (_ele, _name) {
            var className = _ele.class || _ele.className;
            var reg = reg = new RegExp('(\\s|^)' + _name + '(\\s|$)');
            if (!className.match(reg)) {
                className = className + (className ? ' ' : '') + _name;
                _ele.className = className;
            }
        },
        remove:function (_ele) {
            while (_ele.firstChild){
                _ele.removeChild(_ele.firstChild);
            }
        },
        alert:function (msg) {
            doc.getElementById("alertContent").innerHTML = msg;
            doc.getElementById("alert").style['display'] = 'block';
        }
    }
})(window);

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
  formatLocation: formatLocation
}
