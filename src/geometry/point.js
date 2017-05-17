import { linearTick, max, min } from '../util/util';
import { Circle } from '../shape/circle';
import { Base } from './base'

class PointChart extends Base {
	constructor({ data, x, y, width, height, render }) {
		super({
			data: data,
			x: x,
			y: y,
			width: width,
			height: height,
			render: render
		});
	}
	
	computeShape() {
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