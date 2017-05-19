import { linearTick, max, min, unique, getCol, group } from '../util/util';

class Geometry {
	constructor({ data, dim, x, y, width, height, render, space }) {
		this.data = data;
		this.dim = dim;

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

	color(color) {
		this.color = color;
	}

	computeData() {
		let dim = this.dim;

		let xData = unique(getCol(this.data, dim.x));
		let colorData = null;
		let yData = null;
		if(dim.color) {
			colorData = unique(getCol(this.data, dim.color));
			yData = group(this.data, dim.y, dim.x, dim.color);
		}
		else {
			yData = group(this.data, dim.y, dim.x).map((group) => group.slice(0, 1));
		}

		return { xData, yData, colorData }	
	}

	computeTick(yData) {
		let data = yData.reduce((pre, cur) => pre.concat(cur), []);

		let tickArray = linearTick(min(data), max(data));
		let minTick = min(tickArray);
		let maxTick = max(tickArray);

		return { minTick, maxTick };
	}

	on(shape, data) {
		let self = this;

		shape.addEventListener('click', function (context, x, y) {
			self.onclick(context, x, y, data);
		});

		shape.addEventListener('mousemove', function (context, x, y) {
			self.onmousemove(context, x, y, data);
		});

		shape.addEventListener('mouseover', function (context, x, y) {
			self.onmouseover(context, x, y, data);
		});

		shape.addEventListener('mouseout', function (context, x, y) {
			self.onmouseout(context, x, y, data);
		});
	}

	getShape() {
		this.shapeArray = this.computeShape();
		return this.shapeArray
	}
}

export { Geometry }