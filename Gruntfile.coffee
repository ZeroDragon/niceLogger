module.exports = (grunt)->
  grunt.initConfig(
    coffee :
      options :
        bare : true
      compile :
        expand : true
        flatten : true
        cwd : 'bin/'
        src : ['*.coffee']
        dest : 'bin/'
        ext : '.js'
    watch :
      coffee :
        files : 'bin/*.coffee'
        tasks : ['coffee']
        options :
          livereload: true
  )
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.registerTask 'default', ['watch']