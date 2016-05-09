var express = require('express');
var https = require('https');
var cfg = require('./config');
var url= require('url');
var fs = require('fs');
var log4js = require('log4js');
var querystring = require("querystring");

var logger = log4js.getLogger('iportal');

module.exports = {
    requestticket: function(req, res, next, selectedUser, userDirectory, restURI, userApp) {
        //Configure parameters for the ticket request
        var options = {
            host: url.parse(restURI).hostname,
            port: url.parse(restURI).port,
            path: url.parse(restURI).path + '/ticket?xrfkey=aaaaaaaaaaaaaaaa',
            method: 'POST',
            headers: { 'X-qlik-xrfkey': 'aaaaaaaaaaaaaaaa', 'Content-Type': 'application/json' },
            cert: fs.readFileSync(cfg.CLIENTCERT),
            key: fs.readFileSync(cfg.CLIENTKEY),
            passphrase: cfg.CERTIFICATEPWD,
            rejectUnauthorized: false,
            agent: false
        };

        logger.info("requestTicket: Ticket Options (", options.path.toString(),")");
        //Send ticket request
        var ticketreq = https.request(options, function (ticketres) {
            logger.info("requestTicket: statusCode: (", ticketres.statusCode,")");       

            ticketres.on('data', function (d) {
                //Parse ticket response                
                logger.trace("requestTicket: POST Response \n", d.toString());
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
                    logger.trace("requestTicket: Qlik Sense Ticket \n",ticket);              
                                    
                    //Add the QlikTicket to the REDIRECTURI regardless whether the existing userApp has existing params.                
                    logger.debug("requestTicket: cfg.REDIRECTURI (",cfg.REDIRECTURI,")");
                    logger.debug("requestTicket: userApp: (",userApp,")");
                    var myRedirect = url.parse(cfg.REDIRECTURI);
                    
                    var myQueryString = querystring.parse(myRedirect.query);                
                    myQueryString['QlikTicket'] = ticket.Ticket; 
                    
                    var redirectURI = cfg.REDIRECTURI + userApp + '?Qlikticket=' + ticket.Ticket;			    
                    logger.debug("requestTicket: Redirecting to (", redirectURI,")");
                    
                    res.redirect(redirectURI);
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