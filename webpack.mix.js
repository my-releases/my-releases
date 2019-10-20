let mix = require('laravel-mix');

let LiveReloadPlugin = require('webpack-livereload-plugin');

let inProduction = mix.inProduction();

if (inProduction) {
    process.env.NODE_ENV = 'production';
}

// inProduction = false; // testing purposes only. Save prod files into .full.[css/js] to see the file size
mix.webpackConfig({
    plugins: [new LiveReloadPlugin()],
    output: {
        chunkFilename: 'public/static/js/chunks/[name].js',
    },
});

mix.sass(
    'resources/sass/app.scss',
    'public/static/css/app.'+(inProduction ? 'min' : 'full')+'.css'
);

mix.js(
    'resources/js/app.js',
    'public/static/js/app.'+(inProduction ? 'min' : 'full')+'.js'
);

