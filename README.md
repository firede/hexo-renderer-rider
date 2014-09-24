# [Rider](https://github.com/ecomfe/rider) renderer for [Hexo](https://github.com/hexojs/hexo)

Add support for [Stylus](https://github.com/LearnBoost/stylus), [Rider](https://github.com/ecomfe/rider) and [Autoprefixer](https://github.com/ai/autoprefixer).

Rider is a CSS library to focus on Mobile Web, build on top of Stylus.

## Install

```sh
$ npm install hexo-renderer-rider --save
```

__Notice: if `hexo-renderer-rider` does not work, maybe you need uninstall `hexo-renderer-stylus` first, they are all supported `Stylus`.__

## Options

You can configure this plugin in `_config.yml`, like this:

```yaml
rider:
  compress: true
  autoprefixer:
    browsers:
      - Android >= 2.3
      - iOS >= 6
```

* compress - Compress generated CSS
* autoprefixer - Parse CSS and add vendor prefixes to rules by Can I Use [see more options](https://github.com/postcss/autoprefixer#browsers)

## License

MIT &copy; [Firede](https://github.com/firede)
