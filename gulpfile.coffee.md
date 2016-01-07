Gulpfile. Nuff said.

    gulp = require('gulp')
    coffee = require('gulp-coffee')

    gulp.task 'coffee', ->
      gulp.src "src/*.coffee.md"
          .pipe coffee bare: true
          .pipe gulp.dest 'js'


    gulp.task 'default', ['coffee']
