import { LeeChart } from '../src/leechart';

let month = ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'];
let data = [
	{name: 'Tokyo',data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]},
	{name: 'New York',data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]},
	{name: 'London',data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]},
	{name: 'Berlin',data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]}
].reduce(function (pre, cur) {

	let array = cur.data.map((rainfall, index) => {
		return {
			name: cur.name,
			month: month[index],
			rainfall: rainfall
		}
	});
	return pre.concat(array);
}, [])

// let data = ['first class', 'second class', 'third class', 'forth class', 'fifth class'].map(function (item) {
// 	return {
// 		color: item,
// 		value: Math.floor(100000 + 100000*Math.random())
// 	}
// });

// let lineChart = new LeeChart(document.querySelector('#line'));
let barChart = new LeeChart(document.querySelector('#bar'));
// let pointChart = new LeeChart(document.querySelector('#point'));
// let pieChart = new LeeChart(document.querySelector('#pie'));

// lineChart.type('line').data(data).x('month').y('rainfall').color('name').layout().render();
barChart.type('bar').data(data).color('name').x('month').y('rainfall').build().layout().render();
// pointChart.type('point').data(data).x('month').y('rainfall').color('name').layout().render();
// pieChart.type('pie').data(data).theta('value').color('color').layout().render();