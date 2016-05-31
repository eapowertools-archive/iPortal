
var qrsInteract = require('../lib/qrsinteractions');
var config = require('../config/config');
var winston = require('winston');
var Promise = require('bluebird');

//set up logging
var logger = new (winston.Logger)({
	level: config.logLevel,
	transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: config.logFile})
    ]
});

var body = {
    "prefix": config.virtualProxy,
    "description": config.virtualProxy,
    "authenticationModuleRedirectUri":"https://" + config.hostname + ":" + config.serverPort + "/",
    "sessionModuleBaseUri":"",
    "loadBalancingModuleBaseUri":"",
    "authenticationMethod":0,
    "anonymousAccessMode":0,
    "windowsAuthenticationEnabledDevicePattern":"Windows",
    "sessionCookieHeaderName":"X-Qlik-Session-" + config.virtualProxy,
    "sessionCookieDomain":"",
    "additionalResponseHeaders":"",
    "sessionInactivityTimeout":30,
    "extendedSecurityEnvironment":false,
    "websocketCrossOriginWhiteList":[config.hostname],
    "defaultVirtualProxy":false,
    "tags":[]
};



function createVirtualProxy(body)
{
    var x ={};
    var path = "https://" + config.hostname + ":" + config.qrsPort + "/qrs/servernodeconfiguration";
    path +=  "?xrfkey=ABCDEFG123456789&filter=name eq 'Central'";
    qrsInteract.get(path)
    .then(function(result)
    {
       logger.info('servicenodeconfiguration: ' + JSON.stringify(result), {module:'createVirtualProxy'}); 
       return result[0].id; 
    })
    .then(function(result)
    {
       
        logger.info('passed result id: '+ result, {module: 'createVirtualProxy'});
        var postPath =  "https://" + config.hostname + ":" + config.qrsPort + "/qrs/VirtualProxyConfig";
        postPath +=  "?xrfkey=ABCDEFG123456789&privileges=true";

        if(result !== undefined)
        {
            body.loadBalancingServerNodes =
            [
                {
                    "id": result
                }
            ];
        }

        qrsInteract.post(postPath,body)
        .then(function(result)
        {
            x.virtualProxy = JSON.parse(result);
            //logger.debug('Result from Server::' + JSON.stringify(JSON.parse(result)), {module: 'createVirtualProxy'});
            logger.info('Virtual Proxy created', {module: 'createVirtualProxy'});
            logger.debug('Virtual Proxy id: ' + x.virtualProxy.id, {module:'createVirtualProxy'});
            
        })
        .then(function()
        {
            //get the proxy to set link up virtualproxy
            var proxyPath = "https://" + config.hostname + ":" + config.qrsPort + "/qrs/proxyservice/local";
            proxyPath +=  "?xrfkey=ABCDEFG123456789";
            logger.debug('proxyPath:: ' + proxyPath,{module: 'createVirtualProxy'});
            qrsInteract.get(proxyPath)
            .then(function(result)
            {
                x.proxyID = result.id;
                logger.debug('The proxy service id is: ' + result.id, {module: 'createVirtualProxy'});
                return result.id;
            })
            .then(function(proxyID)
            {
                var selectionPath = "https://" + config.hostname + ":" + config.qrsPort + "/qrs/selection";
                selectionPath +=  "?xrfkey=ABCDEFG123456789";
                logger.debug('selectionPath::' + selectionPath, {module: 'createVirtualProxy'});
                var selectionBody = {
                    "items": [
                        {
                            "type": "ProxyService",
                            "objectID": proxyID
                        }
                    ]
                };
                logger.debug('selectionBody:' + JSON.stringify(selectionBody), {module: 'createVirtualProxy'});
                qrsInteract.post(selectionPath,selectionBody)
                .then(function(result)
                {
                    x.Selection = JSON.parse(result);
                    logger.debug('selectionID::' + result.id, {module: 'createVirtualProxy'});
                    return x.Selection.id
                })
                .then(function(selectionID)
                {
                    var putPath = "https://" + config.hostname + ":" + config.qrsPort + "/qrs/selection";
                    putPath += "/" + selectionID + "/ProxyService/synthetic";
                    putPath +=  "?xrfkey=ABCDEFG123456789";
                    logger.debug('putPath::' + putPath, {module: 'createVirtualProxy'});
                    logger.debug('virtual proxy id::' + x.virtualProxy.id, {module:'createVirtualProxy'});
                    var putBody = {
                        "type":"ProxyService",
                        "children": [
                            {
                                "name":"settings",
                                "properties": [
                                    {
                                        "name": "refList_VirtualProxyConfig",
                                        "value": {
                                            "added": [
                                                x.virtualProxy.id
                                            ],
                                            "removed": []
                                        },
                                        "valueIsDifferent": false,
                                        "valueIsModified": true
                                    }],
                                "type":"ProxyService.Settings"
                            }],
                        "properties": [
                            {
                                "name":"serverNodeConfiguration",
                                "value": null,
                                "valueIsDifferent": false,
                                "valueIsModified": false
                            }],
                        "latestModifiedDate": buildModDate()      
                    };
                    qrsInteract.put(putPath,putBody)
                    .then(function()
                    {
                        logger.info('virtual proxy: ' + x.virtualProxy.id+ ' linked to proxy: ' + x.proxyID, {module: 'createVirtualProxy'});
                    })
                    .catch(function(error)
                    {
                       logger.error(error,{module: 'createVirtualProxy'}); 
                    });
                })
                .catch(function(error)
                {
                     logger.error(error,{module: 'createVirtualProxy'});
                });
            })
            .catch(function(error)
            {
                 logger.error(error,{module: 'createVirtualProxy'});
            })
        })
        .catch(function(error)
        {
             logger.error(error,{module: 'createVirtualProxy'});
           return error; 
        });
    })
    .catch(function(error)
    {
         logger.error(error,{module: 'createVirtualProxy'});
       return error;
    });    

    
}

function buildModDate()
{   
    var d = new Date();
    return d.toISOString();
}

createVirtualProxy(body);
