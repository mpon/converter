module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			files: ['lib/*.js', 'spec/*.js'],
			tasks: ['jshint']
		},
		jshint: {
			files: ['lib/*.js', 'spec/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');

}