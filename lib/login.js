var express = require('express');
var https = require('https');
var cfg = require('../config/config');
var url= require('url');
var fs = require('fs');
var winston = require('winston');
var querystring = require("querystring");

//set up logging
var logger = new (winston.Logger)({
	level: cfg.logLevel,
	transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: cfg.logFile})
    ]
});

module.exports = {
    requestticket: function(req, res, next, selectedUser, userDirectory, restURI, userApp) {
        
        var XRFKEY = rand(16);
        //Configure parameters for the ticket request
        try {
            
            logger.debug(cfg.client);
            
            var options = {
                host: url.parse(restURI).hostname,
                port: url.parse(restURI).port,
                path: url.parse(restURI).path + '/ticket?xrfkey=' + XRFKEY,
                method: 'POST',
                headers: 
                { 
                    'X-qlik-xrfkey': XRFKEY, 
                    'Content-Type': 'application/json' 
                },
                cert: fs.readFileSync(cfg.certificates.client),
                key: fs.readFileSync(cfg.certificates.client_key),
                rejectUnauthorized: false,
                agent: false
            };
        } catch (e) {
            logger.error(e);
            res.render('error', e);            
        }

        logger.info("requestTicket: Ticket Options (" ,  options.path.toString() , ")");
        //Send ticket request
        var ticketreq = https.request(options, function (ticketres) {
            logger.info("requestTicket: statusCode: (", ticketres.statusCode,")");       

            ticketres.on('data', function (d) {
                //Parse ticket response                
                logger.info("requestTicket: POST Response \n", d.toString());
                if (ticketres.statusCode!=201) {
                    var authError = {};
                    authError.message = "Invalid response code ("+ticketres.statusCode+") from Qlik Sense.";
                    authError.response = d.toString();
                    authError.ticket = options.path.toString();
                    authError.request = jsonrequest;
                    res.render('autherror', authError);
                } else {                                                     
                    // Get the ticket returned by Qlik Sense
                    var ticket = JSON.parse(d.toString());  
                    logger.info("requestTicket: Qlik Sense Ticket \n",ticket);              
                                    
                    //Add the QlikTicket to the REDIRECTURI regardless whether the existing userApp has existing params.                
                    var redirectUri = 'https://' +  cfg.hostname + '/' + cfg.virtualProxy + '/'; 
                    logger.debug("requestTicket: (",redirectUri,")");
                    logger.debug("requestTicket: userApp: (",userApp,")");
                    var myRedirect = url.parse(redirectUri);
                    
                    var myQueryString = querystring.parse(myRedirect.query);                
                    myQueryString['QlikTicket'] = ticket.Ticket; 
                    
                    // The redirectURI currently works for any application that is simply a path on the Qlik Sense URL (ex. /hub, /qmc, or /devhub)
                    // TODO: Exhance this code to support launching applications that are not an extension of the Qlik Sense URL. 
                    var finalRedirectURI = redirectUri + userApp + '?Qlikticket=' + ticket.Ticket;			    
                    logger.debug("requestTicket: Redirecting to (", finalRedirectURI,")");
                    
                    res.redirect(finalRedirectURI);
                }
            });
        });

        //Send JSON request for ticket
        var jsonrequest = JSON.stringify({ 'userDirectory': userDirectory.toString() , 'UserId': selectedUser.toString(), 'Attributes': [] });
        logger.debug("requestTicket: JSON request: ",jsonrequest);

        ticketreq.write(jsonrequest);
        ticketreq.end();

        ticketreq.on('error', function (e) {
            logger.error("requestTicket: Error submitting authentication request (",e,")");
            logger.error('Error' + e);
        });
    }
};

//Supporting functions
function rand(length, current) {
  current = current ? current : '';
  return length ? rand(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
}