const path = require('path')

module.exports = {
	mode: 'development',
	entry: '/dist/js/filteredQuestions.js',
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'filteredQuestionsBundle.js'
	},
	watch: true
}