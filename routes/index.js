var express = require('express');
var cfg = require('../qlik/config');
var login = require('../qlik/login');
var users = require('../qlik/users');
var handlebars = require('hbs');
var router = express.Router();
var log4js = require('log4js');

var logger = log4js.getLogger('iportal');
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

	res.render('index', config);
});

router.get('/login', function(req, res, next) {
		logger.debug('Route: GET /login');
		
		var user = req.query.user;
		var directory = req.query.directory;
		var app = req.query.app;
		
		logger.debug('Route: GET /login - USER: (',user,') DIRECTORY: (', directory,')');
		
		logger.debug('Route: GET /login - Requesting ticket...');
		login.requestticket(req, res, next, user, directory, cfg.AUTHURI, app);
		
		req.session.destroy();
	});

module.exports = router;
