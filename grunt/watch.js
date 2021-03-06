module.exports = {
	express: {
		files: [
			'app.js',
			'public/js/lib/**/*.{js,json}',
		],
		tasks: ['concurrent:dev'],
	},
	less: {
		files: ['public/**/*.less'],
		tasks: ['less'],
	},
	livereload: {
		files: [
			'public/styles/**/*.css',
		],
		options: {
			livereload: true,
		},
	},
};
