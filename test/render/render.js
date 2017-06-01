import { LeeRender } from '../../src/leerender';
import { Line } from '../../src/shape/line';
import { Circle } from '../../src/shape/circle';
import { Rect } from '../../src/shape/rect';
import { Text } from '../../src/shape/text'

let leeRender = new LeeRender(document.querySelector('#leerender'));

let rect = new Rect({
	x: 0,
	y: 0,
	width: 25,
	height: 25,
	style: {
		fillStyle: 'yellow'
	}
});
rect.when(1000, {
	width: 500,
	height: 500
}).when(1000, {
	width: 375,
	height: 200	
}).start();



rect.addEventListener('click', function (context, x, y) {
	console.log('click', x, y);
});

rect.addEventListener('mousemove', function (context, x, y) {
	console.log('mousemove', x, y);
});

rect.addEventListener('mouseover', function (context, x, y) {
	console.log('mouseover', x, y);
});

rect.addEventListener('mouseout', function (context, x, y) {
	console.log('mouseout', x, y);
});

leeRender.addShape(rect);
leeRender.render();