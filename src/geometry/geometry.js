import { linearTick, max, min, unique, getCol, group } from '../util/util';

class Geometry {
	constructor({ data, color, x, y, width, height, render, space }) {
		this.data = data;
		this.color = color;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.render = render;
		this.space = space;

		this.onclick = function () {};
		this.onmousemove= function () {};
		this.onmouseover = function () {};
		this.onmouseout = function () {};
	}

	computeTick(data, isBeginAtZero = false) {
		let _data = data.reduce((pre, cur) => pre.concat(cur), []);
		let maxData = max(_data);
		let minData = isBeginAtZero ? Math.min(min(_data), 0) : min(_data);
		let tickArray = linearTick(minData, maxData);
		let minTick = min(tickArray);
		let maxTick = max(tickArray);

		return { minTick, maxTick };
	}

	on(shape, groupIndex, index) {
		let self = this;

		shape.addEventListener('click', function (context, x, y) {
			self.onclick(context, x, y, groupIndex, index);
		});

		shape.addEventListener('mousemove', function (context, x, y) {
			self.onmousemove(context, x, y, groupIndex, index);
		});

		shape.addEventListener('mouseover', function (context, x, y) {
			self.onmouseover(context, x, y, groupIndex, index);
		});

		shape.addEventListener('mouseout', function (context, x, y) {
			self.onmouseout(context, x, y, groupIndex, index);
		});
	}

	getShape() {
		return this.computeShape();
	}
}

export { Geometry }