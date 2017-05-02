module.exports = {
	dev: {
		tasks: ['nodemon', 'node-inspector', 'browserSync', 'watch'],
		options: {
			logConcurrentOutput: true,
		},
	},
};
