/**
 * @file Rider renderer plugin for Hexo
 * @author Firede <firede@firede.us>
 */

var rider = require('rider');
var stylus = require('stylus');
var autoprefixer = require('autoprefixer-core');

function getProperty(obj, key) {
    key = key.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');

    var split = key.split('.');
    var result = obj[split[0]];

    for (var i = 1, len = split.length; i < len; i++){
        result = result[split[i]];
    }

    return result;
}

function defineConfig(style) {
    style.define('hexo-config', function(data) {
        return getProperty(hexo._themeConfig, data.val);
    });
}

function prefixer(args, callback) {

    var defArgs = {
        browsers: ['> 5%']
    };

    return function (err, css) {
        if (err) {
            callback(err);
        }

        return autoprefixer.apply(
                this,
                args || defArgs
            ).process(css).css;
    };
}

function renderer(data, options, callback) {
    var config = hexo.config.rider || {};
    var style = stylus(data.text);

    style.set('resolve url', true)
        .use(rider({
            implicit: true
        }))
        .use(defineConfig)
        .set('filename', data.path)
        .set('compress', config.compress)
        .set('include css', true);

    if (config.autoprefixer !== false) {
        style.on('end', prefixer(config.autoprefixer, callback));
    }

    style.render(callback);
}

hexo.extend.renderer.register('styl', 'css', renderer);
