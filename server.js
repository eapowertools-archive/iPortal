process.env.NODE_PATH = __dirname;
var app = require('./app');
var cfg = require('./qlik/config');
var http = require('http');
var http = require('https');
var log4js = require('log4js');
var fs = require('fs');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file(cfg.LOGFILE), 'iportal');

var logger = log4js.getLogger('iportal');

logger.setLevel(cfg.LOGLEVEL);
logger.info('Starting iPortal application...');
logger.info('Log level set to ',cfg.LOGLEVEL);

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(cfg.PORT || '3080');
app.set('port', port);

/**
 * Create HTTP server.
 */
//Server options to run an HTTPS server
try {
  var httpsoptions = {
      cert: fs.readFileSync(cfg.SERVERCERT),
      key: fs.readFileSync(cfg.SERVERKEY),
    
      passphrase: cfg.CERTIFICATEPWD
  };
} catch (e) {
  logger.fatal(e);
  logger.fatal('iPortal application terminated.');
  process.exit(1);
}

var server = http.createServer(httpsoptions, app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges!');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use!');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.info('Listening on ' + bind);
}
