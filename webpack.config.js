let path = require('path');
let fs = require('fs');

let entry = {};
fs.readdirSync('./test').forEach(item => {
	if(/\.js$/.test(item))
		entry[`${item.slice(0, item.length - 3)}-test`] = `./test/${item}`;
})

module.exports = {
	entry: entry,
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};