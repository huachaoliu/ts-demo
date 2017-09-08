const gulp = require("gulp");
const path = require('path');
const del = require('del');
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");

const config = require('config');

gulp.task("default", () => {

    console.log(config.outDir);    
    
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("build"));
});

gulp.task("dist", () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('clean', cb => {
    return del(['dist/*', 'build/*'], { dot: true });
});