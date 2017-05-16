import { LeeChart } from '../src/leechart';

let data = ['first class', 'second class', 'third class', 'forth class', 'fifth class'].map(function (item) {
	return {
		color: item,
		value: 100000 + 100000*Math.random()
	}
});

let lineChart = new LeeChart(document.querySelector('#line'));
let barChart = new LeeChart(document.querySelector('#bar'));
let pointChart = new LeeChart(document.querySelector('#point'));
let pieChart = new LeeChart(document.querySelector('#pie'));

lineChart.type('line').data(data).x('color').y('value').color('color').layout().render();
barChart.type('bar').data(data).x('color').y('value').color('color').layout().render();
pointChart.type('point').data(data).x('color').y('value').color('color').layout().render();
pieChart.type('pie').data(data).theta('value').color('color').layout().render();