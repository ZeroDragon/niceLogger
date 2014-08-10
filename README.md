Nice Logger
=========================
The nicelogger module will add some fancy options to the regular console.log in node.js  

##Instalation

  npm install niceLogger

A config file is required to load information on nicelogger. Here is an example:

    {
      "logger" : {
        "appInfo" : "../package.json",
        "date" : true,
        "time" : true,
        "machineName" : false,
        "separatedTimestamp" : false,
        "separatedInfo" : false,
        "months" : [
          "Ene","Feb","Mar","Abr","May","Jun",
          "Jul","Ago","Sep","Oct","Nov","Dic"
        ]
      }
    }

##Options
Nicelogger will load the app name and version from the `package.json`.

`date : [bool]` Will display or hide the date in the log  
`time : [bool]` Will display or hide the time in the log  
`machineName : [bool]` Will display or hide the machine name in the log  
`separatedTimestamp : [bool]` If setted true, will insert a line break after the timestamp info on the log  
`separatedInfo : [bool]` If setted true, will insert a line break between every element passed to the log  
`months : [array]` A set of month names to display. Default: English

##Usage
First require nice logger and don't forget the config file

    config = require('./config.json');
    logger = require('niceLogger').config(config.logger);

Now you can use all the features that nice logger has:

###Welcome message

    logger.welcome();

The welcome message will log a fancy colored info of your node application.

###Five flavours of log

    logger.log('This is a regular log message');
    logger.debug('This is a debug message');
    logger.info('This is an info message');
    logger.warning('This is a warning message');
    logger.error('This is an error message');

Every log flavour outputs some information about the machine, date, time and type of log. The types of logs are colored on white for regular, blue for debug, green for info, yellow for warning and red for error.  
Also there is no limit of params to send to the logs, just like the ol' console.log

###Inline logs

    //Countdown Function
    logger.countdown(
      'This is a countdown for {timeout} seconds',
      5,1000
    );


    //Single in-line log
    logger.progress(['progress is: ',counter]);

The **countdown** is a single function that will execute untill the intervals are done, and when finished it will fire the callback

    logger.countdown(message, number_of_intervals, interval[, callback]);

`message : [string]` The string to send to the countdown. You can define a variable `{timeout}` that will receive the current timeout counter on the log.  
`number_of_intervals : [int]` The number of times the countdown will be executed.  
`interval : [int]` The time that each interval will last in miliseconds.  
`callback : [function]` (**optional**) This function will be called when the number of invertals reach zero.  

The **progress** is a function that will overwrite itself everytime it is called, use it inside your loops to create loading states. When finished, just set `done` to true.

    logger.progress(items_to_display[, done]);

`items_to_display: [array]` This items will be the output of the log. The reason that this are an array and not a single string is because you can send different variables at the same time and all of them will be written in order.  
`done : [bool]` (**optional**) Set this one to true to insert a line break after the log and end the in-line logging.

##ConsoleColors and extra stuff
All collors are displayed using the consolecolors package. And since it mutates the string prototype, you can use all of those colors and styles on your regular logs, or even mix them into the loggers. For more info take a look at [ConsoleColors](https://github.com/ZeroDragon/consolecolors).  
Also built in the logger is a titleize function that will set to uppercase every first letter of a string. Use it like this:

    "this is a string".titleize
    //This Is A String

##Test
There is a test file that uses some of the functions in different ways so you can see how those works together. To fire the test just do:

    npm test

or 

    cd nicelogger
    node test/nicelogger.js


##Changelog
0.32.06e - Release to github and npm repo
