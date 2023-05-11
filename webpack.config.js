const path = require('path')

module.exports = {
	mode: 'development',
	entry: '/src/simulates/simulates.js',
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'simulatesBundle.js'
	},
	watch: true
}