import { linearTick, max, min } from '../util/util';
import { Circle } from '../shape/circle';
import { Line } from '../shape/line';
import { BezierCurve } from '../shape/bezier-curve';
import { Base } from './base'

class LineChart extends Base {
	constructor({ data, x, y, width, height, render, isBezierCurve = true, isArea = true }) {
		super({
			data: data,
			x: x,
			y: y,
			width: width,
			height: height,
			render: render
		});

		this.isBezierCurve = isBezierCurve;
		this.isArea = isArea;
	}

	computeShape(data) {
		let color = this.color;
		let intervalWidth = this.width/(this.data.length - 1);
		let tickArray = linearTick(min(this.data), max(this.data));
		let minTick = min(tickArray);
		let maxTick = max(tickArray);

		let lastX = 0;
		let lastY = 0;
		let shapeArray = [];

		let pointArray = this.data.map((item, index) => {
			let x = this.x + index*intervalWidth;
			let pointHeight = this.height*(item - minTick)/(maxTick - minTick);
			let y = this.y + this.height - pointHeight;

			return {
				x: x,
				y: y
			};
		}, this);

		let T = Line;
		if(this.isBezierCurve)
			T = BezierCurve;

		let line = new T({
			pointArray: pointArray,
			style: {
				strokeStyle: color[0],
				lineWidth: 2,
			},
			zIndex: 1,
			isAnimation: true			
		});

		return [line].concat(pointArray.map(({ x,y }) => {
			return new Circle({
				x: x,
				y: y,
				r: 3,
				style: {
					fillStyle: '#ffffff',
					strokeStyle: color[0],
					lineWidth: 2
				},
				renderType: 'fillstroke',
				zIndex: 2
			});
		}));
	}
}

export { LineChart }