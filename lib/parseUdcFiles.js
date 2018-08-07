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
        
        // Read the file of users
        var usersFile = fs.readFileSync(path.join(cfg.csvFilePath, userFile), { encoding: 'utf8' });
        // Read the file of user attributes
        var attributesFile = fs.readFileSync(path.join(cfg.csvFilePath, attributeFile), { encoding: 'utf8' });

        // Convert the list of users to an object array
        var userArray = csv.toObject(usersFile);
        if (userArray.length > 0) {
            logger.info("parseUdcFiles: ", userArray.length, " users loaded");
        } else {
            logger.info("parseUdcFiles: no users parsed from csv file");
            throw new Error("error: no users parsed from csv file");
        }

        // Convert the list of user attributes to an object array
        var attributesArray = csv.toObject(attributesFile);
        if (attributesArray.length > 0) {
            logger.info("parseUdcFiles: ", attributesArray.length, " attribute records loaded");
        } else {
            logger.info("parseUdcFiles: no attributes parsed from csv file");
            throw new Error("error: No attributes parsed from attributes file");
        }

        // Build array of distinct groups (may not need this logic)
        var QlikGroups = [];                        
        var CorpGroups = [];        

        attributesArray.forEach(function(attr, index) {                                
                if (attr.type == 'group')  {                    
                    if (attr.value.substring(0,4)=='Qlik') {
                        if (QlikGroups.indexOf(attr.value.substring(4))==-1)
                            QlikGroups.push(attr.value.substring(4));                       
                    } else if (attr.value.substring(0,3)=='Lic') {
                        // Ignore
                    }
                    else {
                        if (CorpGroups.indexOf(attr.value)==-1)
                            CorpGroups.push(attr.value);   
                    }
                }
            }
        );

        // Build array of users with attributes
        var Users = {};

        userArray.forEach(function(user, index) {
            var User = {
                userid: user.userid,
                name: user.name
            };

            var userAttributes = attributesArray.filter(function(item) {
                return item.userid == User.userid;
            });

            var qlikGroups = [];
            var corpGroups = [];
            var userApps = [];

            userAttributes.forEach(function(item) {
                switch (item.type) {
                    case "group":                                                      
                        if (item.value.substring(0,4)=='Qlik') {
                            if (qlikGroups.indexOf(item.value.substring(4))==-1)
                                qlikGroups.push(item.value.substring(4));                       
                        } else if (item.value.substring(0,7)=='License') {
                            User.license = item.value.substring(7);
                        }
                        else {
                            if (corpGroups.indexOf(item.value)==-1)
                                corpGroups.push(item.value);   
                        }                                                                                            
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
                    case "license":
                        User.license = item.value;
                        break;
                    default:
                        User[item.type] = item.value;

                }
            });

            User.qlikGroups = qlikGroups;
            User.corpGroups = corpGroups;
            User.apps = userApps;
            Users[index] = User;
        })

        var config = {};
        config.users = Users;
        config.qlikGroups = QlikGroups;
        config.corpGroups = CorpGroups;        
        
        logger.info("Completed parsing UDC csv files.");
        return config;

    }
}