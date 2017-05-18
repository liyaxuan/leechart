import { LeeRender } from '../src/leerender';
import { Rect } from '../src/shape/rect';

let leeRender = new LeeRender(document.querySelector('#leerender'));
let rect = new Rect({
	x: 10,
	y: 10,
	width: 200,
	height: 200
})
rect.addEventListener('mousemove', function (context, x, y) {
	console.log(x, y);
})
leeRender.addShape(rect);
leeRender.render();