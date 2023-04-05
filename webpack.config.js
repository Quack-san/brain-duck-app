const path = require('path')

module.exports = {
	mode: 'development',
	entry: '/src/questions/questionScript.js',
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'questionsBundle.js'
	},
	watch: true
}