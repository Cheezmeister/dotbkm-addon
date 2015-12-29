Gulpfile.

    gulp = require('gulp')
    coffee = require('gulp-coffee')

    gulp.task 'coffee', ->
      # Sources
      gulp.src "src/*.coffee.md"
          .pipe coffee bare: true
          .pipe gulp.dest 'js'


    gulp.task 'default', ['coffee']
