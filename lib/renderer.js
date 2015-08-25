/**
 * @file Rider renderer plugin for Hexo
 * @author Firede <firede@firede.us>
 */

var stylus = require('stylus');
var rider = require('rider');
var postcss = require('postcss');
var mqpacker = require('css-mqpacker');
var ap = require('autoprefixer-core');

/**
 * 后处理器
 *
 * @param  {Object} options 选项
 * @param  {Array|boolean=} options.autoprefixer Autoprefixer支持
 * @param  {boolean=} options.mqpacker mqpacker启用状态
 * @param  {Function} callback callback
 * @return {Function} autoprefixer function
 */
function postprocessor(options, callback) {

    var defaultBrowsers = ['> 5%', 'Android >= 4', 'iOS >= 7', 'ExplorerMobile >= 10'];

    return function (err, css) {
        if (err) {
            callback(err);
        }

        var processors = [];

        if (options.autoprefixer !== false) {
            processors.push(
                ap({browsers: options.autoprefixer || defaultBrowsers})
            );
        }

        if (options.mqpacker !== false) {
            processors.push(mqpacker);
        }

        if (processors.length > 0) {
            return postcss(processors).process(css).css;
        }

        return css;
    };
}

/**
 * 获取属性
 *
 * @see hexo-renderer-stylus/lib/renderer.js
 */
function getProperty(obj, name) {
    name = name.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');

    var split = name.split('.');
    var key = split.shift();

    if (!obj.hasOwnProperty(key)) {
        return '';
    }

    var result = obj[key];
    var len = split.length;

    if (!len) {
        return result || '';
    }
    if (typeof result !== 'object') {
        return '';
    }

    for (var i = 0; i < len; i++) {
        key = split[i];
        if (!result.hasOwnProperty(key)) {
            return '';
        }

        result = result[split[i]];
        if (typeof result !== 'object') {
            return result;
        }
    }

    return result;
}


module.exports = function (data, options, callback) {
    var self = this;
    var config = this.config.rider || {};

    function defineConfig(style) {
        style.define('hexo-config', function (data) {
            return getProperty(self.theme.config, data.val);
        });
    }

    var style = stylus(data.text);

    style.define('url', stylus.resolver())
        .use(rider({implicit: true}))
        .use(defineConfig)
        .set('filename', data.path)
        .set('sourcemap', config.sourcemaps)
        .set('compress', config.compress)
        .set('include css', true);

    style.on('end', postprocessor(config, callback));

    style.render(callback);
};
