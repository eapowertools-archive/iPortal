var csv = require('csvjson');
var cfg = require("../config/config")
var path = require("path");
var winston = require("winston");
var fs = require('fs');

//set up logging
var logger = new(winston.Logger)({
    level: cfg.logLevel,
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({ filename: cfg.logFile })
    ]
});

module.exports = function() {
    var appsFile = fs.readFileSync(path.join(cfg.csvFilePath, "app_paths.csv"), { encoding: 'utf8' });

    var appsArray = csv.toObject(appsFile);
    if (appsArray.length > 0) {
        logger.info("appPaths: ", appsArray.length, " apps loaded");
    } else {
        logger.info("appPaths: no apps parsed from csv file");
        throw new Error("error: no apps parsed from csv file");
    }
    return appsArray;

};