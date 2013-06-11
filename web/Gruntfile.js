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
      default: {
        src: ['dev/*', 'dist/*', 'src/js/lib/*']
      },
      dev: {
        src: ['dev/*', 'dev/.*']
      },
      dist: {
        src: ['dist/*', 'dist/.*']
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
          jQuery: true,
          Path: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      main: {
        src: 'src/js/main.js'
      }
    },


    sass: {
      dev: {
        trace: true,
        bundleExec: true,
        files: {
          'dev/css/styles.css': 'src/scss/styles.scss'
        }
      },
      release: {
        files: {
          'dist/css/styles.css': 'src/scss/styles.scss'
        }
      }
    },


    // concat all js to scripts.js

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dev: {
        src: ['src/js/lib/jquery.js', 'src/js/lib/jquery.selectbox.js', 'src/js/lib/!(modernizr).js', 'src/js/compat.js', 'src/js/util.js', 'src/js/main.js'], // , 'src/js/traces.js'
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
        '.htaccess',
    ],
    all_folders: [
        'css/',
        'img/**'
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
          }, {
            src: 'src/js/lib/modernizr.js',
            cwd: 'src/',
            dest: 'dev/js/modernizr.js'
          }, {
            expand: true,
            src: '<%= all_folders %>',
            cwd: 'src/',
            dest: 'dev/'
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
      },
      data: {
        files: [{
            expand: true,
            src: '../data/json/*.json',
            // cwd: 'dev/data/',
            dest: 'dev/data/',
            filter: 'isFile'
          }
        ]
      }
    },

    compass: {
      dev: { // Another target
        options: {
          sassDir: 'src/scss',
          cssDir: 'dev/css'
        }
      }
    },

    // watch for change to main.js and trigger 'Default' task

    watch: {
      scripts: {
        files: ['src/js/*.js', 'src/scss/*.scss', 'src/index.html'], // , 'src/js/lib/*.js'
        tasks: ['default'],
        options: {
          interrupt: true,
        },
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-compass');
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
  grunt.registerTask('install', ['bower', 'copy:data']);

  // Default task.
  // jshint & concat to dev/
  // grunt.registerTask('default', ['sass:dev', 'jshint:main', 'concat:dev', 'copy:dev']);
  grunt.registerTask('default', ['jshint:main', 'concat:dev', 'copy:dev', 'compass:dev']);

  // build production
  grunt.registerTask('dist', ['install', 'clean:dist', 'jshint:main', 'concat:dist', 'uglify', 'copy:dist']);

  // grunt.event.on('watch', function(action, filepath) {
  //   grunt.log.writeln(filepath + ' has ' + action);
  // });

};