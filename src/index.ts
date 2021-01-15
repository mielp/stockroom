require('module-alias/register'); // for path resolution

import fastify, { FastifyInstance } from 'fastify';
import { App, pkg } from '@/config';

let app: FastifyInstance;
let cleanExit = false;

/**
 * Start the server
 */
async function boot() {
  console.info();
  console.info(`🌸 Starting ${pkg.name} v${pkg.version} in ${App.ENV} mode`);
  // TODO: connect to the database

  // Listen to HTTP requests
  app = fastify(/* { logger: true } */);
  app.listen(App.PORT, (err) => {
    if (err) {
      console.error('   😖 Unable to start the HTTP server');
      process.exit(1);
    }
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
  if (!app.server.listening) {
    console.error('   😖 HTTP server was not started');
    process.exit(1);
  }
  app.close(() => {
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
