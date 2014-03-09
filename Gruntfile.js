module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			files: ['lib/*.js', 'spec/*.js', 'Gruntfile.js'],
			tasks: ['jshint']
		},
		jshint: {
			files: ['lib/*.js', 'spec/*.js', 'Gruntfile.js']
		},
		shell: {
			jsdoc: {
				options: {
					stdout: true
				},
				command: 'node_modules/.bin/jsdoc lib/converter.js -d docs'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-shell');

};