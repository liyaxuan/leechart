import { LeeRender } from '../src/leerender';
import { Line } from '../src/shape/line';
import { Circle } from '../src/shape/circle';
import { Rect } from '../src/shape/rect';
import { Text } from '../src/shape/text'

let leeRender = new LeeRender(document.querySelector('#leerender'));
// let rect = new Rect({
// 	x: 0,
// 	y: 0,
// 	width: 25,
// 	height: 25,
// 	style: {
// 		fillStyle: 'yellow'
// 	}
// });

// let circle = new Circle({
// 	x: 300,
// 	y: 100,	
// 	r: 25,
// 	style: {
// 		fillStyle: 'red'
// 	}
// })

// circle.when(1000, {
// 	r: 100
// })

// rect.when(1000, {
// 	width: 375,
// 	height: 200
// }, function () {
// 	circle.start(false);
// }).start(false);


// leeRender.addShape(circle);
// leeRender.addShape(rect);


let text = new Text({
	x: 50,
	y: 50,
	value: '123456',
	style: {
		fontSize: 20
	}
});

leeRender.addShape(text);
leeRender.render();