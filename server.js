process.env.NODE_PATH = __dirname;
var app = require('./app');
var cfg = require('./config/config');
var https = require('https');
var winston = require('winston');
var fs = require('fs');

//set up logging
var logger = new (winston.Logger)({
	level: cfg.logLevel,
	transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: cfg.logFile})
    ]
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(cfg.serverPort || '3090');
app.set('port', port);

/**
 * Create HTTPs server.
 */
//Server options to run an HTTPS server
try {
  var httpsoptions = {
      cert: fs.readFileSync(cfg.certificates.server),
      key: fs.readFileSync(cfg.certificates.server_key)
  };
} catch (e) {
  logger.error(e);
  logger.error('iPortal application terminated.');
  process.exit(1);
}

var server = https.createServer(httpsoptions, app);

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
