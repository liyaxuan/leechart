import { LeeRender } from '../../src/leerender';
import { Rect } from '../../src/shape/rect';
import { Text } from '../../src/shape/text';

let leeRender = new LeeRender(document.querySelector('#leerender'));
let context = leeRender.getContext();

context.textAlign = 'center';
context.textBaseline = 'bottom';
context.font = '40px sans-serif '

let text = new Text({
	x: 0,
	y: 0,
	value: 'heiheihei',
	rotate: 10*Math.PI/180,
	style: {
		fillStyle: 'black'
	}
});

let { x, y, width, height } = text.getBoundingRect(context);

let rectH = new Rect({
	x: 0,
	y: y,
	width: 500,
	height: height,
	style: {
		fillStyle: 'rgba(255, 0, 0, 0.4)'
	},
	renderType: 'fill'
});

let rectV = new Rect({
	x: x,
	y: 0,
	width: width,
	height: 500,
	style: {
		fillStyle: 'rgba(0, 0, 255, 0.4)'
	},
	renderType: 'fill'
});

let info = new Text({
	x: 400,
	y: 400,
	value: 'left top',
	style: {
		fillStyle: 'black'
	}
});

leeRender.addShape(rectH);
leeRender.addShape(rectV);
leeRender.addShape(text);
leeRender.addShape(info);

let textAlign = ['left', 'center', 'right'];
let textBaseline = ['top', 'middle', 'bottom'];

let i = 0;
let index = 0;

setInterval(function () {

	text.rotate = -1*i*Math.PI/180;
	let { x, y, width, height } = text.getBoundingRect(context);
	rectH.y = y;
	rectH.height = height;
	rectV.x = x;
	rectV.width = width;

	leeRender.render();

	if(i === 359) {
		index = (index + 1)%9;
		context.textAlign = textAlign[index%3];
		context.textBaseline = textBaseline[Math.floor(index/3)];

		info.value = `${context.textAlign} ${context.textBaseline}`;
	}

	i = (i + 1)%360;
}, 10);

leeRender.render();