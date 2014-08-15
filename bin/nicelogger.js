var logger, os, pkg, _makeBox, _px, _toString,
  __slice = [].slice;

require('consolecolors');

pkg = false;

os = require('os');

logger = {};

Object.defineProperty(String.prototype, 'titleize', {
  configurable: true,
  get: function() {
    var array, word, words, _i, _len;
    words = this.match(/([A-Z]?[^A-Z]*)/g).slice(0, -1).join(' ');
    words = words.split(/\s|_|-/);
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
  var i, joiner, retval, string, _i, _len;
  retval = [];
  for (_i = 0, _len = data.length; _i < _len; _i++) {
    i = data[_i];
    switch (typeof i) {
      case 'string':
        retval.push(i);
        break;
      default:
        string = JSON.stringify(i, null, 2);
        string = string.replace(/([\[\]\{\}\(\)])/gi, "$1".red).replace(/([:,])/gi, "$1".yellow).replace(/([^"]true)/gi, "$1".blue).replace(/([^"]false)/gi, "$1".magenta).replace(/(".*?")/gi, "$1".green);
        retval.push(string);
    }
  }
  joiner = logger.separatedInfo ? "\n" : ' ';
  return retval.join(joiner);
};

_makeBox = function(msg) {
  var biggerItem, boxSize, boxStr, endBox, i, k, offset, str, _i, _j, _k, _l, _len, _len1, _ref;
  boxStr = '';
  for (k = _i = 0, _len = msg.length; _i < _len; k = ++_i) {
    str = msg[k];
    msg[k] = '# '.blue + str;
  }
  biggerItem = msg.reduce(function(a, b) {
    a = a.replace(/\u001b\[[0-9]+m/gi, '');
    b = b.replace(/\u001b\[[0-9]+m/gi, '');
    if (a.length > b.length) {
      return a;
    } else {
      return b;
    }
  });
  boxSize = biggerItem.length;
  for (k = _j = 0, _len1 = msg.length; _j < _len1; k = ++_j) {
    str = msg[k];
    endBox = '';
    offset = boxSize - str.replace(/\u001b\[[0-9]+m/gi, '').length;
    for (i = _k = 0; 0 <= offset ? _k <= offset : _k >= offset; i = 0 <= offset ? ++_k : --_k) {
      endBox += ' ';
    }
    msg[k] = str + endBox + '#'.blue;
  }
  for (i = _l = 0, _ref = boxSize + 1; 0 <= _ref ? _l <= _ref : _l >= _ref; i = 0 <= _ref ? ++_l : --_l) {
    boxStr += "#";
  }
  msg.unshift(boxStr.blue);
  msg.push(boxStr.blue);
  return msg;
};

exports.config = function(config, path) {
  var k, v;
  for (k in config) {
    v = config[k];
    logger[k] = v;
  }
  pkg = {};
  try {
    pkg = require(path + '/' + logger.appInfo);
  } catch (_error) {}
  return exports;
};

exports.welcome = function(extraInfo) {
  var author, k, msg, v;
  if (extraInfo == null) {
    extraInfo = false;
  }
  msg = [];
  msg.push('Welcome to: '.green + pkg.name.titleize.magenta);
  msg.push('Version: '.green + pkg.version.yellow);
  if (typeof pkg.author === 'string') {
    author = pkg.author;
  } else {
    author = pkg.author.replace(/[^a-zA-Z0-9|@]/gi, ' ').replace(/name|email|/gi, '').replace(/\s+/gi, ' ').trim();
  }
  msg.push('Author: '.green + author.red);
  if (extraInfo) {
    for (k in extraInfo) {
      v = extraInfo[k];
      msg.push((k.titleize + ': ').green + v.red);
    }
  }
  msg = _makeBox(msg);
  return console.log(msg.join("\n"));
};

exports.box = function(info, defColor) {
  var k, line, msg, v;
  if (defColor == null) {
    defColor = true;
  }
  msg = [];
  for (k in info) {
    v = info[k];
    line = (k.titleize + ' ').green + v.red;
    if (!defColor) {
      line = (k.titleize + ' ') + v;
    }
    msg.push(line);
  }
  msg = _makeBox(msg);
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
  if (process.stdout.clearLine) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(data.join(''));
    if (done) {
      return console.log('');
    }
  } else {
    if (done) {
      return console.log(data.join(''));
    }
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
  if (process.stdout.clearLine) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(message.replace('{timeout}', length));
  }
  length--;
  if (length >= 0) {
    return timer = setTimeout(function() {
      return exports.countdown(message, length, interval, callback);
    }, interval);
  } else {
    if (process.stdout.clearLine) {
      console.log('');
    } else {
      console.log(message.replace('{timeout}', length + 1));
    }
    if (callback) {
      return callback();
    }
  }
};
