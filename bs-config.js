"use strict";
var fallback = require( 'connect-history-api-fallback' );
var log = require( 'connect-logger' );

module.exports = {
  port: 3000,
  files: [
    './build/src/**/*.{html,htm,css,js}'
  ],
  server: {
    baseDir: './',
    middleware: [
      log( { format: '%date %status %method %url' }),
      fallback( {
        index: '/build/src/index.html',
        htmlAcceptHeaders: [ "text/html", "application/xhtml+xml" ] // systemjs workaround
      })
    ]
  }
}