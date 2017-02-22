let orchardModulePath = 'Media/_external_modules/form_plano_metropolitano/app/';

/**
 * System configuration for Angular samples
 * Adjust as necessary for your application needs.
 */
( function ( global ) {

  let appPath = undefined;

  // Para tratar o deploy em homologação e produção, sem precisar ficar alterando o valor de System.config -> map.app
  if ( global.location && ( global.location.host.indexOf( 'condevit' ) >= 0 || global.location.host.indexOf( 'planometropolitano' ) >= 0 ) ) {
    appPath = orchardModulePath;
  } else {
    orchardModulePath = '';
    appPath = 'build/src/app/';
  }

  System.config( {
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: appPath,

      // angular bundles
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/router/upgrade': 'npm:@angular/router/bundles/router-upgrade.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

      // app related
      'oidc-client': 'npm:oidc-client/lib/oidc-client.js',
      '@prodest/mapeandoes-typings': 'npm:@prodest/mapeandoes-typings/index.js',
      'leaflet': 'npm:leaflet/dist/leaflet-src.js',
      'leaflet.vectorgrid': 'npm:leaflet.vectorgrid/dist/Leaflet.VectorGrid.bundled.js',
      'leaflet.gridlayer.googlemutant': 'npm:leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant.js',
      'leaflet.locatecontrol': 'npm:leaflet.locatecontrol/dist/L.Control.Locate.min.js',
      'leaflet.markercluster': 'npm:leaflet.markercluster/dist/leaflet.markercluster.js',

      // other libraries
      'rxjs': 'npm:rxjs',
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js'
    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './main.js?v=0.0.3',
        defaultExtension: 'js'
      },
      rxjs: {
        defaultExtension: 'js'
      }
    }
  });
})( this );

