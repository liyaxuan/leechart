import { linearTick, max, min } from '../util/util';
import { Rect } from '../shape/rect';

class BarChart {
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

		let intervalWidth = this.width/(this.data.length + 1);
		let barWidth = intervalWidth*0.4;
		let tickArray = linearTick(min(this.data), max(this.data));
		let minTick = min(tickArray);
		let maxTick = max(tickArray);

		return this.data.forEach((item, index) => {
			let x = this.x + (index + 1)*intervalWidth - barWidth/2;
			let barHeight = this.height*(item - minTick)/(maxTick - minTick);
			let y = this.y + this.height - barHeight;

			let rect = new Rect({
				x: x,
				y: y,
				width: barWidth,
				height: barHeight,
				style: {
					fillStyle: color[index]
				},
				isAnimation: true
			});

			rect.addEventListener('onmouseover', function () {

			});

			rect.addEventListener('onmouseout', function () {

			});

			return rect;
		}, this);
	}
}

export { BarChart }