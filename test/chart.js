import { LeeChart } from '../src/leechart';

let month = ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'];
let data = [
	{ name: 'Tokyo', data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4] },
	{ name: 'New York', data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3] },
	{ name: 'London', data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2] },
	{ name: 'Berlin', data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1] }
].reduce(function (pre, cur) {
	let array = cur.data.map((rainfall, index) => {
		return {
			name: cur.name,
			month: month[index],
			rainfall: rainfall
		}
	});

	return pre.concat(array);
}, []);

let pointChart = new LeeChart(document.querySelector('#point'));
pointChart.type('point').data(data).color('name').x('month').y('rainfall').render();

let lineChart = new LeeChart(document.querySelector('#line'));
lineChart.type('line').data(data).color('name').x('month').y('rainfall').render();

let barChart = new LeeChart(document.querySelector('#bar'));
barChart.type('bar').data(data).color('name').x('month').y('rainfall').render();

let pieChart = new LeeChart(document.querySelector('#pie'));
pieChart.type('pie').data(data).color('name').theta('rainfall').render();

let doughnutChart = new LeeChart(document.querySelector('#doughnut'));
doughnutChart.type('doughnut').data(data).color('name').theta('rainfall').render();

let polarChart = new LeeChart(document.querySelector('#polar'));
polarChart.type('polar').data(data).color('name').theta('month').r('rainfall').render();