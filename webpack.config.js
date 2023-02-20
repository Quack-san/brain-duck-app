const path = require('path')

module.exports = {
	mode: 'development',
	entry: '/dist/js/simulados.js',
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'bundle.js'
	},
	watch: true
}