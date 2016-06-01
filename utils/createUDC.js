
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
    "configured" : false,
    "configuredError":"",
    "creationType": 1,
    "name": config.userDirectory,
    "operational": false,
    "operationalError": "",
    "settings": [{
        "name":"User directory name",
        "value": config.userDirectory,
        "secret": false,
        "userDirectorySettingType":"String"   
    },
    {
        "name":"Users table",
        "value":"[Users$]",
        "secret": false,
        "userDirectorySettingType":"String"
    },
    {
        "name":"Attributes table",
        "value":"[Attributes$]",
        "secret": false,
        "userDirectorySettingType": "String"
    },
    {
        "name": "Connection string part 1",
        "value": "DRIVER={Microsoft Excel Driver (*.xls, *.xlsx, *.xlsm, *.xlsb)};DBQ=" + process.argv[2] + "\\udc\\excel\\iportal_users.xlsx",
        "secret": false,
        "userDirectorySettingType": "String"
    },
    {
        "name": "Connection string part 2 (secret)",
        "secretValue": "",
        "secret": true,
        "userDirectorySettingType": "String",
        "value": "" 
    },
    {
        "name": "Synchronization timeout in seconds",
        "secret": false,
        "userDirectorySettingType":"Int",
        "value": "240"
    }],
    "tags":[],
    "syncOnlyLoggedInUsers": false,
    "syncStatus": 0,
    "type": "Repository.UserDirectoryConnectors.ODBC.OdbcExcel"
};



function createUDC(body)
{
    var x ={};
    var path = "https://" + config.hostname + ":" + config.qrsPort + "/qrs/UserDirectory";
    path +=  "?xrfkey=ABCDEFG123456789";
    qrsInteract.post(path, body)
    .then(function(result)
    {
       x.UDC = JSON.parse(result);
       logger.info('UDC Creation: ' + JSON.stringify(JSON.parse(result)), {module:'createUDC'}); 
       return x.UDC.id; 
    })
    .then(function(result)
    {
       
        logger.info('passed result id: '+ result, {module: 'createUDC'});
        var postPath =  "https://" + config.hostname + ":" + config.qrsPort + "/qrs/userdirectoryconnector/syncuserdirectories";
        postPath +=  "?xrfkey=ABCDEFG123456789";

        var syncBody = [];
        syncBody.push(result);
        logger.info('syncing UDC: ' + syncBody, {module: 'createUDC'});
        qrsInteract.post(postPath,syncBody)
        .then(function(sCode)
        {
            if(sCode==204)
            {
                logger.info('User Directory Sync started', {module: 'createUDC'});            
            }
        })
        .catch(function(error)
        {
             logger.error(error,{module: 'createUDC'});
           return error; 
        });
    })
    .catch(function(error)
    {
         logger.error(error,{module: 'createUDC'});
       return error;
    });    

    
}

function buildModDate()
{   
    var d = new Date();
    return d.toISOString();
}

createUDC(body);
