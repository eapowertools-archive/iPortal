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

module.exports = {
    loadUsers: function(userFile, attributeFile) {
        logger.info('parseUdcFiles: Reading csv files (', cfg.csvFilePath, ")...");
        var usersFile = fs.readFileSync(path.join(cfg.csvFilePath, userFile), { encoding: 'utf8' });

        var attributesFile = fs.readFileSync(path.join(cfg.csvFilePath, attributeFile), { encoding: 'utf8' });

        var userArray = csv.toObject(usersFile);
        if (userArray.length > 0) {
            logger.info("parseUdcFiles: ", userArray.length, " users loaded");
        } else {
            logger.info("parseUdcFiles: no users parsed from csv file");
            throw new Error("error: no users parsed from csv file");
        }

        var attributesArray = csv.toObject(attributesFile);
        if (attributesArray.length > 0) {
            logger.info("parseUdcFiles: ", attributesArray.length, " attribute records loaded");
        } else {
            logger.info("parseUdcFiles: no attributes parsed from csv file");
            throw new Error("error: No attributes parsed from attributes file");
        }


        var Users = {};

        userArray.forEach(function(user, index) {
            var User = {
                userid: user.userid,
                name: user.name
            };



            var userAttributes = attributesArray.filter(function(item) {
                return item.userid == User.userid;
            });

            var userGroups = [];
            var userApps = [];

            userAttributes.forEach(function(item) {
                switch (item.type) {
                    case "group":
                        userGroups.push(item.value);
                        break;
                    case "app":
                        userApps.push(item.value);
                        break;
                    case "image":
                        User.image = item.value;
                        break;
                    case "udc":
                        User.udc = item.value;
                        break;
                    case "title":
                        User.title = item.value;
                        break;
                    default:
                        User[item.type] = item.value;

                }
            });

            User.groups = userGroups;
            User.apps = userApps;
            Users[index] = User;
        })

        var config = {};
        config.users = Users;
        logger.info("Completed parsing UDC csv files.");
        return config;

    }
}