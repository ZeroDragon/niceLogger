//The requiring part
config = require('./config.json');
logger = require('../bin/nicelogger.js').config(config.logger,__dirname+'/..');

//The logger functions
logger.welcome();
logger.log('This is a regular log message');
logger.debug('This is a debug message');
logger.info('This is an info message');
logger.warning('This is a warning message');
logger.error('This is an error message');

//Consecutive logs in the same line
logger.countdown(
  'This is a countdown for'.green+
  ' {timeout} '.blue+
  'seconds'.green,
  5,
  1000, function(){
    logger.countdown(
      'This is a countdown for'.yellow+
      ' {timeout} '.red+
      'centiseconds'.yellow,
      20,
      100, function(){
        logger.countdown(
          'This is a countdown for'.red+
          ' {timeout} '.magenta+
          'miliseconds'.red,
          1000,
          1, progress
        );
      }
    );    
  }
);

count = 0;
timer = false;
var progress = function(){
  clearTimeout(timer);
  i = (count+1) % 20;
  var dots = new Array(i+1).join('.');
  count++;
  if(count<100){
    logger.progress(['This process is: ',(count+'%').red,' done',dots]);
    timer = setTimeout(function(){
      progress();
    },50);
  }else{
    logger.progress(['This process is done'],true);
    end();
  }
};

//end
var end = function(){
  logger.info('The end of the example.'.red.inverse,'Happy codding'.yellow.inverse);
  process.exit();
};