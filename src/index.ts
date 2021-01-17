if (!process.env.TS_NODE_DEV) {
  require('module-alias/register'); // for path resolution
}

import { createServer, Server } from 'http';
import { default as express, Express } from 'express';
import { App, pkg } from '@/config';
import { setup } from '@/routes';

let app: Express;
let server: Server;
let cleanExit = false;

/**
 * Start the server
 */
async function boot() {
  console.info();
  console.info(`🌸 Starting ${pkg.name} v${pkg.version} in ${App.ENV} mode`);
  // TODO: connect to the database

  // Setup the routes
  app = express();
  setup(app);
  server = createServer(app);

  // Listen to HTTP requests
  server.on('error', (err) => {
    console.error('   😖 Unable to start the HTTP server');
    console.error(err);
    process.exit(1);
  });
  server.listen(App.PORT, () => {
    console.info('   ✓ HTTP server listening on port', App.PORT);
    process.send?.('ready'); // PM2
  });
}

/**
 * Stop the server
 */
async function terminate(signal: string) {
  console.info();
  console.info(`🧹 Received ${signal}; shutting down the server`);
  cleanExit = true;

  // Stop the HTTP server
  if (!server.listening) {
    console.error('   😖 HTTP server was not started');
    process.exit(1);
  }
  server.close(() => {
    console.info('   ✓ HTTP server terminated');
    process.exit(0);
  });
}

function exit() {
  if (!cleanExit) {
    console.info('😖 The process was terminated abruptly.');
  }
}

boot();
process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);
process.on('exit', exit);
