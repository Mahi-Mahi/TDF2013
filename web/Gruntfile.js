/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    build: {
      dest: 'dist'
    },

    // INSTALL base components

    bower: {
      dev: {
        dest: 'src/js/lib'
      }
    },

    clean: {
      all: {
        src: ['dev/*', 'dist/*', 'src/js/lib/*']
      },
      dev: {
        src: ['dev/*']
      },
      dist: {
        src: ['dist/*']
      }
    },

    //   jshint only main.js

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      main: {
        src: 'src/js/main.js'
      }
    },

    // concat all js to scripts.js

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dev: {
        src: ['src/js/lib/*.js', 'src/js/main.js'],
        dest: 'dev/js/scripts.js'
      },
      dist: {
        src: ['src/js/lib/*.js', 'src/js/main.js'],
        dest: 'dist/js/scripts.js'
      }
    },

    // dist : uglify scripts.js

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: '<%= concat.dist.dest %>'
      }
    },

    all_files: [
        'index.html',
        '.htaccess'
    ],


    // copy other src files to dest
    copy: {
      dev: {
        files: [{
            expand: true,
            src: '<%= all_files %>',
            cwd: 'src/',
            dest: 'dev/',
            filter: 'isFile'
          }
        ]
      },
      dist: {
        files: [{
            expand: true,
            src: '<%= all_files %>',
            cwd: 'src/',
            dest: 'dist/',
            filter: 'isFile'
          }
        ]
      }
    },

    // watch for change to main.js and trigger 'Default' task

    watch: {
      scripts: {
        files: 'src/js/main.js',
        tasks: ['default'],
        options: {
          interrupt: true,
        },
      },
      gruntfile: {
        files: 'gruntfile.js',
        tasks: ['default'],
        options: {
          interrupt: true,
        },
      },
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower');

  /*
  grunt-contrib-coffee


  grunt-contrib-imagemin
  grunt-contrib-htmlmin
  grunt-contrib-compress

  grunt-contrib-clean
  */

  // install librariries
  grunt.registerTask('install', ['bower']);

  // Default task.
  // jshint & concat to dev/
  grunt.registerTask('default', ['clean:dev', 'jshint:main', 'concat:dev', 'copy:dev']);

  // build production
  grunt.registerTask('build', ['install', 'clean:dist', 'jshint:main', 'concat:dist', 'uglify']);

  // grunt.event.on('watch', function(action, filepath) {
  //   grunt.log.writeln(filepath + ' has ' + action);
  // });

};