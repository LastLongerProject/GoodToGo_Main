const gulp = require("gulp");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const addSrc = require("gulp-add-src");
const notify = require("gulp-notify");

function js() {
  return gulp
    .src("resources/js/jquery-3.2.1.min.js")
    .pipe(addSrc.append("resources/js/bootstrap.min.js"))
    .pipe(addSrc.append("resources/js/jquery.easing.min.js"))
    .pipe(addSrc.append("resources/js/parallax.min.js"))
    .pipe(addSrc.append("resources/js/scrolling-nav.js"))
    .pipe(addSrc.append("resources/js/jquery.scrollify.js"))
    .pipe(addSrc.append("resources/js/jquery.waypoints.min.js"))
    .pipe(addSrc.append("resources/js/app.js"))
    .pipe(sourcemaps.init())
    .pipe(concat("app.min.js"))
    .pipe(
      uglify().on(
        "error",
        notify.onError(function (error) {
          return "Js 編譯發生錯誤： " + error;
        })
      )
    )
    .pipe(sourcemaps.write("./map"))
    .pipe(gulp.dest("build/assets/js/"))
    .pipe(notify("js 檔案混淆成功"));
}

function css() {
  return gulp
    .src("resources/sass/pages/*.sass")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write("./map"))
    .pipe(gulp.dest("build/assets/css"))
    .pipe(notify("css 編譯成功"));
}

function browser_sync() {
  browserSync.init({
    server: {
      baseDir: "./build/",
    },
  });

  gulp.watch(["build/**/*.*"]).on("change", function () {
    browserSync.reload();
  });
}

function watch() {
  gulp.watch("resources/sass/**/*.sass", css);
  gulp.watch("resources/js/*.js", js);
}

const build_assets = gulp.parallel(js, css);
const develop = gulp.series(
  gulp.parallel(js, css),
  gulp.parallel(browser_sync, watch)
);

gulp.task("default", develop);
gulp.task("build", build_assets);
