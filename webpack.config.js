const path = require('path')

module.exports = {
	mode: 'development',
	entry: '/src/dbscript/index.js',
	output: {
		path: path.resolve(__dirname, 'src/dbscript'),
		filename: 'bundle.js'
	},
	watch: true
}