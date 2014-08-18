//The requiring part
config = require('./config.json');
logger = require('../bin/nicelogger.js').config(config.logger,__dirname+'/..');

//The logger functions
extraInfo = {
  environment : 'development',
  running_with : process.title +' '+ process.version
};
logger.welcome(extraInfo);

logger.debug('This is a debug message');
logger.info('This is an info message');
logger.warning('This is a warning message');
logger.error('This is an error message');
logger.log('This is a regular log message');

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
  logger.box({
    'demonstration finished':'',
    'thanks_for_using_this_package':'happy face',
    'any_comments_to_my_email:':'npm@zerothedragon.com'
  });
  process.exit();
};