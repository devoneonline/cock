/*
* eVA
* Version: 2.3.0
* copyright (c) 2018 everis Spain S.A
* Date: 01 December 2018
* Author: everis bots@everis.com - Guilherme Ferreira Gomes, Renan Ventura, Evelyn Neves, Luiz Afonso
* All rights reserved
*/

'use strict';

var gulp = require('gulp'),
    less = require('gulp-less'),
    util = require('gulp-util'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify-es').default,
    htmlmin = require('gulp-htmlmin'),
    cleanCss = require('gulp-clean-css'),
    rev = require('gulp-rev'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    clean = require("gulp-clean"),
    cssmin = require('gulp-cssmin'),
    pump = require('pump');

gulp.task('public-less', function() {
    gulp.src('./client/css/less/*.less')
        .pipe(less().on('error', util.log))
        .pipe(cleanCss())
        .pipe(rename({
            "suffix":'.min'
        }))
        .pipe(gulp.dest('client/css'));
});
gulp.task('default', function(callback) {
  sonarqubeScanner({
    serverUrl : "https://sonar.eva.bot",
    token : "29abf656a2944046e23254c10c1d54e05d6d176d",
    options : {
      "sonar.organization": "eva"
    }
  }, callback);
});
gulp.task('public-watch',function() {
    gulp.watch('./client/css/less/*.less', ['public-less']);
});

gulp.task('private-less', function() {
    gulp.src('./client/cockpit/css/less/*.less')
        .pipe(less().on('error', util.log))
        .pipe(cleanCss())
        .pipe(rename({
            "suffix":'.min'
        }))
        .pipe(gulp.dest('client/cockpit/css'));
});

gulp.task('private-watch',function() {
    gulp.watch('./client/cockpit/css/less/*.less', ['private-less']);
});

gulp.task('private-ura-less', function() {
    gulp.src('./client/ura/css/less/*.less')
        .pipe(less().on('error', util.log))
        .pipe(cleanCss())
        .pipe(rename({
            "suffix":'.min'
        }))
        .pipe(gulp.dest('client/ura/css'));
});

gulp.task('private-ura-watch',function() {
    gulp.watch('./client/ura/css/less/*.less', ['private-ura-less']);
});


gulp.task('prod', ['copy'], function() {
    gulp.start('usemin')
  });

gulp.task("copy", ["clean"], function() {
    return gulp.src(["client/**/*", '!client/**/*.min.css'])
    .pipe(gulp.dest("dist"));
});
    
gulp.task("clean", function() {
    return gulp.src("dist").pipe(clean());
});

gulp.task('usemin', function() {
    return gulp.src('client/**/*.html')
        .pipe(usemin({
        js: [uglify],
        css: [cssmin]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['public-less', 'private-less', 'private-ura-less',
                      'public-watch', 'private-watch', 'private-ura-watch']);

 