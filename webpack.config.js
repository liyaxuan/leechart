let path = require('path');
let fs = require('fs');

let entry = {};
fs.readdirSync('./test').forEach(item => {

	entry[`/${item}/${item}`] = `./test/${item}/${item}`;

});

module.exports = [{
	entry: entry,
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'test')
	}
}, {
	entry: { leechart: './src/leechart' },
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
}, {
	entry: { leechart: './src/leechart' },
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'demo/lib/leechart')
	}
}];