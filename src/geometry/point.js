import { linearTick, max, min } from '../util/util';
import { Circle } from '../shape/circle';

class PointChart {
	constructor({ data, x, y, width, height }) {
		this.data = data;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	color(color) {
		this.color = color;
	}

	getShape() {
		let color = this.color;
		let shapeArray = [];

		let intervalWidth = this.width/(this.data.length - 1);
		let barWidth = intervalWidth*0.4;
		let tickArray = linearTick(min(this.data), max(this.data));
		let minTick = min(tickArray);
		let maxTick = max(tickArray);

		return this.data.map((item, index) => {
			let x = this.x + index*intervalWidth;
			let pointHeight = this.height*(item - minTick)/(maxTick - minTick);
			let y = this.y + this.height - pointHeight;

			return new Circle({
				x: x,
				y: y,
				r: 12,
				renderType: 'fill',
				style: {
					fillStyle: color[index]
				},
				isAnimation: true
			});
		}, this);
	}
}

export { PointChart }