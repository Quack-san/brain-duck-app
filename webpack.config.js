const path = require('path')

module.exports = {
	mode: 'development',
	entry: '/src/testSimulates/testSimulate.js',
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'testSimulatesBundle.js'
	},
	watch: true
}