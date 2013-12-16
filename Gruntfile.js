module.exports = function(grunt) {

  var reloadPort = 33333;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      options: {
        livereload: reloadPort
      },
      styles: {
        files: ['sass/*.scss'],
        tasks: ['compass', 'autoprefixer'],
      },
      scripts: {
        files: ['js/*.js'],
        tasks: ['jshint'],
      }
    },
    compass: {
        dev: {
            options: {
                sassDir: 'sass',
                cssDir: 'css',
                specify: 'sass/style.scss',
                outputStyle: 'expanded',
            }
        }
    },
    // less: {
    //     dev: {
    //         paths: ['less/*.less'],
    //         files: {
    //             "style.css": "less/style.less"
    //         }
    //     }
    // },
    autoprefixer: {
        single_file: {
            src: 'css/style.css',
            dest: 'css/style.css'
        },
    },
    csso: {
        dist: {
            options: {
                banner: '/*! Crafted by UX Passion for <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            files: {
                'css/style.css': ['css/style.css']
            }
        }
    },
    imagemin: {                          // Task
        dev: {                         // Another target
          files: [{
            expand: true,                  // Enable dynamic expansion
            cwd: 'img/',                   // Src matches are relative to this path
            src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
            dest: 'img/'                  // Destination path prefix
          }]
        }
      },
    jshint: {
        options: {
          curly: true,
          eqeqeq: true,
          eqnull: true,
          browser: true,
          laxcomma: true,
          globals: {
            jQuery: true
          },
          ignores: ['js/libs/*.js', 'js/*.min.js', 'js/plugins.js']
        },
        files: {
            src: ['js/*.js']
        },
      },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/*.js'],
        dest: 'js/main.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! Crafted by UX Passion for <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      concated_files: {
        files: {
          'js/main.min.js': ['js/main.min.js']
        },
      }
    },
    validation: {
        options: {
            path: '.html-validation.json',
            reportpath: '.html-validation-report.json'
        },
        files: {
            src: ['*.html']
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-csso');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('master', ['compass', 'autoprefixer', 'csso', 'imagemin', 'validation', 'jshint', 'concat', 'uglify']);
  grunt.registerTask('default', ['watch']);

};