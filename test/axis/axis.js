import { LeeRender } from '../../src/leerender';

import { LinearAxis } from '../../src/axis/linear';
import { ThetaAxis } from '../../src/axis/theta';
import { Legend } from '../../src/legend/legend';

let data = ['first class', 'second class', 'third class', 'forth class', 'fifth class'].map(function (item) {
	return {
		color: item,
		value: 100 + 100*Math.random()
	}
});

let leeRender = new LeeRender(document.querySelector('#leerender'));
let context = leeRender.getContext();

// let polarAxis = new PolarAxis({
//  type: 'radar'
// 	thetaData: ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'],
// 	rData: data.map(item => item.value),
// 	x: 50,
// 	y: 50,
// 	width: 400,
// 	height: 400
// });

// leeRender.addShape(polarAxis.getShape());

let thetaAxis = new ThetaAxis({
	type: 'radar',
	thetaData: ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'],
	rData: data.map(item => item.value),
	x: 50,
	y: 50,
	width: 400,
	height: 400
});

leeRender.addShape(thetaAxis.getShape());








leeRender.render();

