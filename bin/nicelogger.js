var logger, os, pkg, _px, _toString,
  __slice = [].slice;

require('consolecolors');

pkg = false;

os = require('os');

logger = {};

Object.defineProperty(String.prototype, 'titleize', {
  get: function() {
    var array, word, words, _i, _len;
    words = this.split(' ');
    array = [];
    for (_i = 0, _len = words.length; _i < _len; _i++) {
      word = words[_i];
      array.push(word.charAt(0).toUpperCase() + word.toLowerCase().slice(1));
    }
    return array.join(' ');
  }
});

_px = function(type) {
  var dateTime, lType, machine, months, now, prefix;
  now = new Date();
  months = logger.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  dateTime = [];
  if (logger.date) {
    dateTime.push(now.getDate() + ' ' + months[now.getMonth()]);
  }
  if (logger.time) {
    dateTime.push(('00' + now.getHours()).slice(-2) + ':' + ('00' + now.getMinutes()).slice(-2) + ':' + ('00' + now.getSeconds()).slice(-2));
  }
  machine = os.hostname();
  prefix = [];
  if (logger.time || logger.date) {
    prefix.push(dateTime.join(' ').white);
  }
  if (logger.machineName) {
    prefix.push(machine.yellow);
  }
  lType = '[' + type + ']';
  switch (type) {
    case 'debug':
      prefix.push(lType.blue);
      break;
    case 'info':
      prefix.push(lType.green);
      break;
    case 'warning':
      prefix.push(lType.yellow);
      break;
    case 'error':
      prefix.push(lType.red);
      break;
    default:
      prefix.push(lType.white);
  }
  if (logger.separatedTimestamp) {
    prefix.push("\n");
  }
  prefix = prefix.join(' ');
  return prefix;
};

_toString = function(data) {
  var i, joiner, retval, _i, _len;
  retval = [];
  for (_i = 0, _len = data.length; _i < _len; _i++) {
    i = data[_i];
    switch (typeof i) {
      case 'string':
        retval.push(i);
        break;
      default:
        retval.push(JSON.stringify(i));
    }
  }
  joiner = logger.separatedInfo ? "\n" : ' ';
  return retval.join(joiner);
};

exports.config = function(config, path) {
  var k, v;
  for (k in config) {
    v = config[k];
    logger[k] = v;
  }
  pkg = require(path + '/' + logger.appInfo);
  return exports;
};

exports.welcome = function() {
  var boxSize, boxStr, i, msg, _i;
  boxStr = '';
  msg = [];
  msg.push(' Welcome to: '.green + pkg.name.titleize.magenta);
  msg.push(' Version: '.green + pkg.version.yellow);
  msg.push(' Author: '.green + pkg.author.red);
  boxSize = msg.reduce(function(a, b) {
    if (typeof a === 'string') {
      a = a.replace(/\u001b\[[0-9]+m/gi, '');
    }
    if (typeof b === 'string') {
      b = b.replace(/\u001b\[[0-9]+m/gi, '');
    }
    if (a.length > b.length) {
      return a.length;
    } else {
      return b.length;
    }
  });
  for (i = _i = 0; 0 <= boxSize ? _i <= boxSize : _i >= boxSize; i = 0 <= boxSize ? ++_i : --_i) {
    boxStr += "#";
  }
  msg.unshift(boxStr.blue);
  msg.push(boxStr.blue);
  msg.push('');
  return console.log(msg.join("\n"));
};

exports.debug = function() {
  var data;
  data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log(_px('debug'), _toString(data));
};

exports.info = function() {
  var data;
  data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log(_px('info'), _toString(data));
};

exports.warning = function() {
  var data;
  data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log(_px('warning'), _toString(data));
};

exports.error = function() {
  var data;
  data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log(_px('error'), _toString(data));
};

exports.log = function() {
  var data;
  data = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  return console.log(_px('log'), _toString(data));
};

exports.progress = function(data, done) {
  if (done == null) {
    done = false;
  }
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(data.join(''));
  if (done) {
    return console.log('');
  }
};

exports.countdown = function(message, length, interval, callback) {
  var timer;
  if (length == null) {
    length = 5;
  }
  if (interval == null) {
    interval = 1000;
  }
  if (callback == null) {
    callback = false;
  }
  clearTimeout(timer);
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(message.replace('{timeout}', length));
  length--;
  if (length >= 0) {
    return timer = setTimeout(function() {
      return exports.countdown(message, length, interval, callback);
    }, interval);
  } else {
    console.log('');
    if (callback) {
      return callback();
    }
  }
};
