let path = require('path');

module.exports = {
	entry: {
		'axis-test': './test/axis.js',
		'text-test': './test/text.js',
		'chart-test': './test/chart.js',
		'render-test': './test/render.js',
		'legend-test': './test/legend.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};