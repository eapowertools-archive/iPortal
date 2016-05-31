process.env.NODE_PATH= __dirname;
var qrsInteract = require('../lib/qrsinteractions');
var config = require('../config/config');
var winston = require('winston');
var Promise = require('bluebird');
var fs = require('fs');

//set up logging
var logger = new (winston.Logger)({
	level: config.logLevel,
	transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: config.logFile})
    ]
});

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

logger.info('Checking for existence of ' + process.argv[2] + ' on port ' + process.argv[3], {module: 'checkHostName.js'});

var path = "https://" + process.argv[2] + ":" + process.argv[3] + "/qrs/ServiceStatus/full";
    path +=  "?xrfkey=ABCDEFG123456789";

qrsInteract.get(path)
.then(function(result)
{
    //console.log(result);
    fs.writeFileSync(config.utilsPath + '\\checkHostName.txt', 'true');
})
.catch(function(error)
{
    //do nothing
});