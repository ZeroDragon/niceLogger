#Requirements
require 'consolecolors'

pkg = false
os = require 'os'
logger  = {}

#Titleize property to use here and anywhere where this package is required
Object.defineProperty String.prototype, 'titleize',
  configurable : true
  get : ()->
    words = @.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1).join ' '
    words = words.split /\s|_|-/
    array = []
    for word in words
      array.push word.charAt(0).toUpperCase()+word.toLowerCase().slice(1)
    return array.join ' '

#We use this to create the prefix for every log event
_px = (type)->
  now = new Date()
  months = logger.months or [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ]
  dateTime = []
  dateTime.push(
    now.getDate() + ' ' + months[now.getMonth()]
  ) if logger.date
  dateTime.push(
    ('00'+now.getHours()).slice(-2) + ':' +
    ('00'+now.getMinutes()).slice(-2) + ':' +
    ('00'+now.getSeconds()).slice(-2)
  ) if logger.time
  machine = os.hostname()
  prefix = []
  prefix.push dateTime.join(' ').white if logger.time or logger.date
  prefix.push machine.yellow if logger.machineName
  lType = '['+type+']'
  switch type
    when 'debug' then prefix.push lType.blue
    when 'info' then prefix.push lType.green
    when 'warning' then prefix.push lType.yellow
    when 'error' then prefix.push lType.red
    else prefix.push lType.white
  prefix.push "\n" if logger.separatedTimestamp
  prefix = prefix.join(' ')
  return prefix

#Will try to parse every object sent to the logger to create nice strings
_toString = (data)->
  retval = []
  for i in data
    switch typeof i
      when 'string' then retval.push i
      else
        string = JSON.stringify i, null, 2
        string = string
          .replace /([\[\]\{\}\(\)])/gi, "$1".red
          .replace /([:,])/gi, "$1".yellow
          .replace /([^"]true)/gi, "$1".blue
          .replace /([^"]false)/gi, "$1".magenta
          .replace /(".*?")/gi, "$1".green
        retval.push string
  joiner = if logger.separatedInfo then "\n" else ' '
  return retval.join joiner

#This creates a box arround your log
_makeBox = (msg)->
  boxStr = ''
  for str,k in msg
    msg[k] = '# '.blue + str
  biggerItem = msg.reduce (a,b)->
    a = a.replace(/\u001b\[[0-9]+m/gi,'')
    b = b.replace(/\u001b\[[0-9]+m/gi,'')
    return if a.length > b.length then a else b
  boxSize = biggerItem.length

  for str,k in msg
    endBox = ''
    offset = boxSize - str.replace(/\u001b\[[0-9]+m/gi,'').length
    endBox+= ' ' for i in [0..offset]
    msg[k] = str + endBox + '#'.blue
  
  boxStr+="#" for i in [0..boxSize+1]
  msg.unshift boxStr.blue
  msg.push boxStr.blue
  return msg

#The export to define some required parameters and caller info
exports.config = (config,path)->
  logger[k] = v for k, v of config
  pkg = {}
  try
    pkg = require path+'/'+logger.appInfo
  return exports

#Welcome will display a nice message, use this for your app :D
exports.welcome = (extraInfo=false)->
  msg = []
  msg.push 'Welcome to: '.green + pkg.name.titleize.magenta
  msg.push 'Version: '.green + pkg.version.yellow
  if typeof pkg.author is 'string'
    author = pkg.author
  else
    author = pkg.author
      .replace /[^a-zA-Z0-9|@]/gi,' '
      .replace /name|email|/gi,''
      .replace /\s+/gi,' '
      .trim()
  msg.push 'Author: '.green + author.red

  if extraInfo
    for k, v of extraInfo
      msg.push (k.titleize+': ').green + v.red

  msg = _makeBox msg
  console.log msg.join "\n"

#Box comment for those ultra fancy logs
exports.box = (info,defColor=true)->
  msg = []
  for k, v of info
    line = (k.titleize+' ').green + v.red
    line = (k.titleize+' ') + v unless defColor
    msg.push line
  msg = _makeBox msg
  console.log msg.join "\n"

exports.debug = (data...)->
  console.log _px('debug'), _toString data
exports.info = (data...)->
  console.log _px('info'), _toString data
exports.warning = (data...)->
  console.log _px('warning'), _toString data
exports.error = (data...)->
  console.log _px('error'), _toString data
exports.log = (data...)->
  console.log _px('log'), _toString data
exports.progress = (data,done=false)->
  if process.stdout.clearLine
    process.stdout.clearLine()
    process.stdout.cursorTo 0
    process.stdout.write data.join ''
    console.log '' if done
  else
    console.log data.join '' if done
exports.countdown = (message,length=5,interval=1000,callback=false)->
  clearTimeout timer
  if process.stdout.clearLine
    process.stdout.clearLine()
    process.stdout.cursorTo 0
    process.stdout.write message.replace '{timeout}', length
  length--
  if length >= 0
    timer = setTimeout ()->
      exports.countdown message,length,interval,callback
    ,interval
  else
    if process.stdout.clearLine
      console.log ''
    else
      console.log message.replace '{timeout}', length+1
    callback() if callback