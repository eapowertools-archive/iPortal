var path = require('path');
var extend = require('extend');

var certPath = path.join(process.env.programdata, '/Qlik/Sense/Repository/Exported Certificates/.Local Certificates');
var logPath = path.join(__dirname, '/../log/');
var routePath = path.join(__dirname, 'server/routes/');
var publicPath = path.join(__dirname, 'public/');
var utilsPath = path.join(__dirname, '/../utils/');
var excelFilePath = path.join(__dirname, '/../udc/excel/iportal_users.xlsx');
var csvFilePath = path.join(__dirname, '/../udc/');

var logFile = logPath + 'iPortal_' + dateTimeString() + '.log';

var config = extend(true, {
    serverPort: 3090,
    qpsPort: 4243,
    qrsPort: 4242,
    repoAccount: 'UserDirectory=Internal;UserId=sa_repository',
    hostname: 'senseServerName',
    virtualProxy: 'iportal',
    allowedConnections: 'domainOfSystems',
    userDirectory: 'iportal',
    sessionSecret: 'iportal-secret',
    certificates: {
        client: path.resolve(certPath, 'client.pem'),
        client_key: path.resolve(certPath, 'client_key.pem'),
        server: path.resolve(certPath, 'server.pem'),
        server_key: path.resolve(certPath, 'server_key.pem'),
        root: path.resolve(certPath, 'root.pem')
    },
    routePath: routePath,
    publicPath: publicPath,
    logPath: logPath,
    logFile: logFile,
    utilsPath: utilsPath,
    excelFilePath: excelFilePath,
    csvFilePath: csvFilePath,
    logLevel: 'debug',
    theme: 'photos',
    version: '1.5.0'
});

module.exports = config;

function dateTimeString() {
    var now = new Date();
    var strDate = now.toISOString();

    return strDate.split(':').join('.');

}