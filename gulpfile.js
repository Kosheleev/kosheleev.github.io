const { src, dest } = require('gulp')
const gulp = require('gulp')

const pug = require('gulp-pug')

const autoprefixer = require('gulp-autoprefixer')
const cssbeautify = require('gulp-cssbeautify')
const cssnano = require('gulp-cssnano')
const removeComments = require('gulp-strip-css-comments')
const sass = require('gulp-sass')

const imagemin = require('gulp-imagemin')

const uglify = require('gulp-uglify')

const del = require('del')
const rename = require('gulp-rename')
const pipeline = require('readable-stream').pipeline
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')

const browserSync = require('browser-sync').create()


/* Paths */

const srcPath = 'src/'
const distPath = 'dist/'

const path = {
  build: {
    html: distPath,
    js: distPath + 'assets/js/',
    css: distPath + 'assets/css/',
    img: distPath + 'assets/img/',
    favicon: distPath,
    fonts: distPath + 'assets/fonts/',
    webfonts: distPath + 'assets/webfonts/'
  },
  src: {
    html: srcPath + 'index.pug',
    js: srcPath + 'assets/js/*.js',
    css: srcPath + 'assets/css/*.css',
    scss: srcPath + 'assets/scss/*.scss',
    img: srcPath + 'assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
    favicon: srcPath + 'assets/favicon/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
    fonts: srcPath + 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}',
    webfonts: srcPath + 'assets/webfonts/**/*.{eot,woff,woff2,ttf,svg}'
  },
  watch: {
    html: srcPath + '**/*.{html,pug}',
    js: srcPath + 'assets/js/*.js',
    css: srcPath + 'assets/css/*.css',
    scss: srcPath + 'assets/scss/**/*.scss',
    img: srcPath + 'assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
    favicon: srcPath + 'assets/favicon/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
    fonts: srcPath + 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}',
    webfonts: srcPath + 'assets/webfonts/**/*.{eot,woff,woff2,ttf,svg}'
  },
  clean: './' + distPath
}


/* Tasks */

function serve() {
  browserSync.init({
    server: {
      baseDir: './' + distPath,
    }
  })
}

function html() {
  return pipeline(
    src(path.src.html, {base: srcPath}),
    plumber(),
    pug(),
    dest(path.build.html),
    browserSync.reload({stream: true})
  )
}

function css() {
  return pipeline(
    src(path.src.scss, {base: srcPath + 'assets/scss/'}),
    plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'SCSS Error',
          message: 'Error: <%= error.message %>'
        })(err)

        this.emit('end')
      }
    }),
    sass({
      includePaths: './node_modules/'
    }),
    autoprefixer({
      cascade: true
    }),
    cssbeautify(),
    cssnano({
      zindex: false,
      discardComments: {
        removeAll: true
      }
    }),
    removeComments(),
    rename({
      suffix: '.min',
      extname: '.css'
    }),
    src(path.src.css, {base: srcPath + 'assets/css/'}),
    dest(path.build.css),
    browserSync.reload({stream: true}),
  )
}

function cssWatch() {
  return pipeline(
    src(path.src.scss, {base: srcPath + 'assets/scss/'}),
    plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'SCSS Error',
          message: 'Error: <%= error.message %>'
        })(err)

        this.emit('end')
      }
    }),
    sass({
      includePaths: './node_modules/'
    }),
    rename({
      suffix: '.min',
      extname: '.css'
    }),
    src(path.src.css, {base: srcPath + 'assets/css/'}),
    dest(path.build.css),
    browserSync.reload({stream: true})
  )
}

function js() {
  return pipeline(
    src(path.src.js, {base: srcPath + 'assets/js/'}),
    plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'JS Error',
          message: 'Error: <%= error.message %>'
        })(err)

        this.emit('end')
      }
    }),
    uglify(),
    dest(path.build.js),
    browserSync.reload({stream: true})
  )
}

function jsWatch() {
  return pipeline(
    src(path.src.js, {base: srcPath + 'assets/js/'}),
    plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'JS Error',
          message: 'Error: <%= error.message %>'
        })(err)

        this.emit('end')
      }
    }),
    uglify(),
    dest(path.build.js),
    browserSync.reload({stream: true})
  )
}

function img() {
  return pipeline(
    src(path.src.img),
    imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 80, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]),
    dest(path.build.img),
    browserSync.reload({stream: true})
  )
}

function favicon() {
  return pipeline(
    src(path.src.favicon),
    imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 80, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]),
    dest(path.build.favicon),
    browserSync.reload({stream: true})
  )
}

function fonts() {
  return pipeline(
    src(path.src.fonts),
    dest(path.build.fonts),
    browserSync.reload({stream: true})
  )
}

function webfonts() {
  return pipeline(
    src(path.src.webfonts),
    dest(path.build.webfonts),
    browserSync.reload({stream: true})
  )
}

function clean() {
  return del(path.clean)
}

function watchFiles() {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.scss, path.watch.css], cssWatch)
  gulp.watch([path.watch.js], jsWatch)
  gulp.watch([path.watch.img], img)
  gulp.watch([path.watch.favicon], favicon)
  gulp.watch([path.watch.fonts], fonts)
  gulp.watch([path.watch.webfonts], webfonts)
}


const build = gulp.series(clean, gulp.parallel(html, css, js, img, favicon, fonts, webfonts))
const watch = gulp.parallel(build, watchFiles, serve)


/* Exports Tasks */
exports.html = html
exports.css = css
exports.js = js
exports.img = img
exports.fonts = fonts
exports.clean = clean
exports.build = build
exports.watch = watch
exports.default = watch
