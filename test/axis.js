import { LeeRender } from '../src/leerender';

import { LinearAxis } from '../src/axis/linear';
import { PolarAxis } from '../src/axis/polar'
import { Legend } from '../src/legend/legend';

let data = ['first class', 'second class', 'third class', 'forth class', 'fifth class'].map(function (item) {
	return {
		color: item,
		value: 100 + 100*Math.random()
	}
});

let leeRender = new LeeRender(document.querySelector('#leerender'));
let context = leeRender.getContext();

// let xAxis = new LinearAxis({
// 	data: data.map((item) => item.color),
// 	x: 50,
// 	y: 350,
// 	width: 50,
// 	length: 300,
// 	position: 'bottom',
// 	isSpace: true
// });

// let { height } = xAxis.getBoundingRect(context);
// height = Math.ceil(height);

// let yAxisLength = 350 - Math.max(height, 50);

// xAxis.width = height;
// xAxis.y = 400 - height- 8;

// let yAxis = new LinearAxis({
// 	data: data.map((item) => item.value),
// 	x: 0,
// 	y: 50,
// 	width: 50,
// 	length: yAxisLength,
// 	position: 'left'
// });

// leeRender.addShape(xAxis.buildShape(context));
// leeRender.addShape(yAxis.buildShape(context));

let polarAxis = new PolarAxis({
	thetaData: data.map(item => item.color),
	rData: data.map(item => item.value),
	x: 50,
	y: 50,
	width: 400,
	height: 400
});
leeRender.addShape(polarAxis.getShape());
leeRender.render();