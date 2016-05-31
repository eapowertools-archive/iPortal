var express = require('express');
var cfg = require('../config/config');
var login = require('../lib/login');
var users = require('../lib/users');
var handlebars = require('hbs');
var router = express.Router();
var winston = require('winston');

//set up logging
var logger = new (winston.Logger)({
	level: cfg.logLevel,
	transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: cfg.logFile})
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
		if (app.toUpperCase()=="HUB") {
			return "btn-success";
		} else {
			return "btn-primary";
		}  		
	});

	var config = users.loadExcelUsers();
	config.cfg = cfg;

	res.render('index', config);
});

router.get('/login', function(req, res, next) {
		logger.debug('Route: GET /login');
		
		var user = req.query.user;
		var directory = req.query.directory;
		var app = req.query.app;
		var authUri = 'https://' + cfg.hostname +  ':' + cfg.qpsPort +  '/qps/' + cfg.virtualProxy;
		
		logger.debug('Route: GET /login - USER: (',user,') DIRECTORY: (', directory,')');
		
		logger.debug('Route: GET /login - Requesting ticket...');
		logger.debug(authUri);
		login.requestticket(req, res, next, user, directory, authUri, app);
		
		req.session.destroy();
	});

module.exports = router;
