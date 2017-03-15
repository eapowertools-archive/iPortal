var express = require('express');
var cfg = require('../config/config');
var login = require('../lib/login');
var users = require("../lib/parseUdcFiles");
var handlebars = require('hbs');
var router = express.Router();
var winston = require('winston');
var appPaths = require("../lib/appPaths")();

//set up logging
var logger = new(winston.Logger)({
    level: cfg.logLevel,
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({ filename: cfg.logFile })
    ]
});
/* 
	GET /

	This is the only web page in this application and it displays the list of users
	associated with the EXCELUDS

 */
router.get('/', function(req, res, next) {
    logger.debug('Route: GET /');

    handlebars.registerHelper('ButtonStyle', function(app) {
        if (app.toUpperCase() == "HUB") {
            return "btn-success";
        } else {
            return "btn-primary";
        }
    });

    var config = users.loadUsers("iportal_users.csv", "iportal_attributes.csv");
    config.cfg = cfg;

    res.render('index', config);
});

router.get('/login', function(req, res, next) {
    logger.debug('Route: GET /login');

    var user = req.query.user;
    var directory = req.query.directory;
    var app = req.query.app;

    var appInfo = getAppInfo(app, res);

    if (appInfo.boolAuth) {
        var authUri = 'https://' + cfg.hostname + ':' + cfg.qpsPort + '/qps/' + cfg.virtualProxy;

        logger.debug('Route: GET /login - USER: (', user, ') DIRECTORY: (', directory, ')');

        logger.debug('Route: GET /login - Requesting ticket...');
        logger.debug(authUri);
        login.requestticket(req, res, next, user, directory, authUri, app, appInfo.path);
        req.session.destroy();
    } else {
        var url = "https://" + cfg.hostname + (appInfo.port == "" ? "" : ":" + appInfo.port) + appInfo.path;
        res.redirect(url);
    }

});

module.exports = router;

function getAppInfo(app, res) {
    //get app information from appPaths array
    var appInfo = appPaths.filter(function(item) {
        return item.appName.toUpperCase() === app.toUpperCase();
    })

    if (appInfo.length == 1) {
        return appInfo[0];
    } else {
        var message;
        if (appInfo.length > 1) {
            message = "More than one reference with the same appName.  This is not allowed.  Fix the app_paths.csv file.";
        } else {
            message = "There is an issue with app_paths.csv.  Like you don't have any app references listed in the file.";
        }
        res.status(400).send("<h1>" + message + "</h1>");
    }
}