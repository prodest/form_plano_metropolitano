module.exports = {
    bundle: {
        main: {
            scripts: [ './app/**/*.js' ],
            styles: './app/**/*.css'
        },
        vendor: {
            scripts: './node_modules/@angular/**/*.js'
        }
    },
    copy: './app/**/*.{png,svg}'
};