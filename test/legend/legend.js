import { LeeRender } from '../../src/leerender';
import { Rect } from '../../src/shape/rect';
import { Legend } from '../../src/legend/legend';
import STYLE from '../../src/theme/macaron';

let leeRender = new LeeRender(document.querySelector('#leerender'));
let legend = new Legend({
	data: ['first', 'second', 'third', 'forth'],
	x: 50,
	y: 0,
	width: 100,
	height: 20,
	render: leeRender,
	position: 'left'
});

let rect = new Rect({
	x: 50,
	y: 0,
	width: 100,
	height: 60,
	style: {
		fillStyle: 'rgba(0, 0, 0, 0.16)'
	}
})

legend.color(STYLE.color.slice(0, 4));

leeRender.addShape(legend.getShape().concat(rect));
leeRender.render();