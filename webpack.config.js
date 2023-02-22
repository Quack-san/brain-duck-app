const path = require('path')

module.exports = {
	mode: 'development',
	entry: '/dist/js/testSimulate.js',
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'testSimulateBundle.js'
	},
	watch: true
}