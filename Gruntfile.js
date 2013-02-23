/*
 * gruntacular
 * https://github.com/OpenWebStack/gruntacular
 *
 * Copyright (c) 2013 Dave Geddes
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('gruntacular');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    options: {
      configFile: 'testacular.conf.js',
      browsers: ['Chrome'],
      singleRun: true
    },
    dev: {
      reporters: 'dots'
    },
    testacular : {
      options: {
        configFile: 'testacular.conf.js',
        runnerPort: 9999,
        browsers: ['Chrome']
      },
      travis: {
        browsers: ['Firefox'],
        singleRun: true
      },
      single: {
        browsers: ['Chrome'],
        singleRun: true
      },
      dev: {
        reporters: 'dots'
      }
    },
    meta: {
      banner: '/**\n' + ' * <%= pkg.description %>\n' +
        ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * @author <%= pkg.author.name %>\n' +
        ' * @link <%= pkg.homepage %>\n' +
        ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' + ' */\n\n'
    },
    builddir: 'build',
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      build: {
        src: ['translate.js'],
        dest: '<%= builddir %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      build: {
        src: ['<%= builddir %>/<%= pkg.name %>.js'],
        dest: '<%= builddir %>/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('travis', ['testacular:travis', 'build']);
  grunt.registerTask('test', ['testacular:single']);

  grunt.registerTask('default', ['test', 'build']);
};