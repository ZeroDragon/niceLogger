Nice Logger
=========================
The nicelogger module will add some fancy options to the regular console.log in node.js  
Inspired by the [winston logger](https://github.com/flatiron/winston), this is a very much
reduced version made from scratch.

## Instalation

    npm install nicelogger

A config file is required to load information on nicelogger. Here is an example:

    {
      "logger" : {
        "appInfo" : "../package.json",
        "date" : true,
        "time" : true,
        "machineName" : false,
        "separatedTimestamp" : false,
        "separatedInfo" : false,
        "logLevel" : "all",
        "months" : [
          "Ene","Feb","Mar","Abr","May","Jun",
          "Jul","Ago","Sep","Oct","Nov","Dic"
        ]
      }
    }

## Options
Nicelogger will load the app name and version from the `package.json`.

`date : [bool]`  
Will display or hide the date in the log  

`time : [bool]`  
Will display or hide the time in the log  

`machineName : [bool]`  
Will display or hide the machine name in the log  

`separatedTimestamp : [bool]`  
If setted true, will insert a line break after the timestamp info on the log  

`separatedInfo : [bool]`  
If setted true, will insert a line break between every element passed to the log  

`logLevel : [String|Array]` (**optional**)  
Define the lower log leve, by default is 'debug'. If a string is provided, that will be the lower level of loggin. The log order is:  
`debug > info > warning > error > log > countdown > progress`
Also you can provide an array of log types, this types will be the only ones that will be logged.

`months : [array]`  
A set of month names to display. Default: English

## Usage
First require nice logger and don't forget the config file

    config = require('./config.json');
    logger = require('nicelogger').config(config.logger, __dirname);

The second parameter is the path to your app config file (needed to get app name, author, version and few stuff to display on the log, this path works alongside the `appInfo` property on the `config.json`

Now you can use all the features that nice logger has:

### Welcome message

    logger.welcome({extra_info_optional:true});

The welcome message will log a fancy colored info of your node application.
You can provide an optional extraInfo object to log something more on the same welcome box.

### Box message

    logger.box({this_one_is_required:true})

Similar to the welcome message, this box message will create a super fancy log inside a box with the parameters provided

### Five flavours of log

    logger.debug('This is a debug message');
    logger.info('This is an info message');
    logger.warning('This is a warning message');
    logger.error('This is an error message');
    logger.log('This is a regular log message');

Every log flavour outputs some information about the machine, date, time and type of log (all off this are configurable to display).  
The log types are colored on white for regular, blue for debug, green for info, yellow for warning and red for error.  
There is no limit of params to send to the logs, just like the ol' console.log
Also is you provide an array or an object, the log will output it formated and colored

### Inline logs

    //Countdown Function
    logger.countdown(
      'This is a countdown for {timeout} seconds',
      5,1000
    );


    //Single in-line log
    logger.progress(['progress is: ',counter]);

The **countdown** is a single function that will execute untill the intervals are done, and when finished it will fire the callback

    logger.countdown(message, number_of_intervals, interval[, callback]);

`message : [string]`  
The string to send to the countdown. You can define a variable `{timeout}` that will receive the current timeout counter on the log.  

`number_of_intervals : [int]`  
The number of times the countdown will be executed.  

`interval : [int]`  
The time that each interval will last in miliseconds.  

`callback : [function]` (**optional**)  
This function will be called when the number of invertals reach zero.  

The **progress** is a function that will overwrite itself everytime it is called, use it inside your loops to create loading states. When finished, just set `done` to true.

    logger.progress(items_to_display[, done]);

`items_to_display: [array]`  
This items will be the output of the log. The reason that this are an array and not a single string is because you can send different variables at the same time and all of them will be written in order.  

`done : [bool]` (**optional**)  
Set this one to true to insert a line break after the log and end the in-line logging.

### Change configurations on run time
Use `logger.set` to modify configurations. You can change the logLevel, machineName, etc.

    logger.set({logLevel:'error')
    logger.debug('This is a debug');
    //nothing is displayed since debug is lower than the logLevel
    
    logger.set({logLevel:'debug'},{machineName:true})
    logger.info('This is an info message')
    //17 Ago 22:13:26 ZeroMac.local [info] This is an info message

## ConsoleColors and extra stuff
All collors are displayed using the consolecolors package. And since it mutates the string prototype, you can use all of those colors and styles on your regular logs, or even mix them into the loggers. For more info take a look at [ConsoleColors](https://github.com/ZeroDragon/consolecolors).  
Also built in the logger is a titleize function that will set to uppercase every first letter of a string. Use it like this:

    "this is a string".titleize
    //This Is A String

## Test
There is a test file that uses some of the functions in different ways so you can see how those works together. To fire the test just do:

    npm test


## Changelog
**17.04.04b**  
- [Feature] Since the versions are not a concern, I'm using now `YY.MM.DD[rev]` format 

**17.04.04**  
- [Feature] Fixed some markdown issues on the readme and added better documentation for the config section thanks to [Maggie Jones Savovska](https://github.com/maggiesavovska) for pointing it out.  

**0.35.07a**  

- [Bugfix] Fixed a problem with circular structures.

**0.33.07a**  

- [Feature] Added logger.config to change configurations on run time.  
- [Feature] Changed box/welcome display.  
- [Feature] Now you can define the log level by a string or an array of allowed log types.  
- [TODO] Add papertrail support.  

**0.33.05a**  

- [Feature] Welcome message now accepts an optional parameter to log extra info on the same box, also, the box is now closed.  
- [Feature] Added a new box type log that requires a parameter with info to display a super fancy log.  
- [Feature] Logs now displays objects and arrays in a formatted way and sintax highlighted.  
- [Fix] Fixed a problem when outputing logs to a file. The countdown and progress functions only logs the last message to avoid problems with log files.  
    
**0.32.07a**  

- Titleize now mimics the whole RoR functionality and allows changes to the prototype.  

**0.32.06g**  

- Added a required path parameter to the config function.  

**0.32.06f**  

- Name changed and fixing typos on readme.  

**0.32.06e**  

- Release to github and npm repo.  
