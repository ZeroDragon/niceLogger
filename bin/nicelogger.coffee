#Nice Logger
require 'consolecolors'
pkg = false
os = require 'os'
logger  = {}
Object.defineProperty String.prototype, 'titleize',
  get : ()->
    words = @.split ' '; array = []
    for word in words
      array.push word.charAt(0).toUpperCase()+word.toLowerCase().slice(1)
    return array.join ' '

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

_toString = (data)->
  retval = []
  for i in data
    switch typeof i
      when 'string' then retval.push i
      else retval.push JSON.stringify i
  joiner = if logger.separatedInfo then "\n" else ' '
  return retval.join joiner

exports.config = (config)->
  logger[k] = v for k, v of config
  pkg = require logger.appInfo
  return exports

exports.welcome = ()->
  boxStr = ''
  msg = []
  msg.push ' Welcome to: '.green + pkg.name.titleize.magenta
  msg.push ' Version: '.green + pkg.version.yellow
  msg.push ' Author: '.green + pkg.author.red
  boxSize = msg.reduce (a,b)->
    a = a.replace(/\u001b\[[0-9]+m/gi,'') if typeof a is 'string'
    b = b.replace(/\u001b\[[0-9]+m/gi,'') if typeof b is 'string'
    return if a.length > b.length then a.length else b.length
  boxStr+="#" for i in [0..boxSize]
  msg.unshift boxStr.blue
  msg.push boxStr.blue
  msg.push ''
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
  process.stdout.clearLine()
  process.stdout.cursorTo 0
  process.stdout.write data.join ''
  console.log '' if done
exports.countdown = (message,length=5,interval=1000,callback=false)->
  clearTimeout timer
  process.stdout.clearLine()
  process.stdout.cursorTo 0
  process.stdout.write message.replace '{timeout}', length
  length--
  if length >= 0
    timer = setTimeout ()->
      exports.countdown message,length,interval,callback
    ,interval
  else
    console.log ''
    callback() if callback