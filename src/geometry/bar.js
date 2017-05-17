import { linearTick, max, min } from '../util/util';
import { Rect } from '../shape/rect';
import { ToolTip } from '../tooltip/tooltip';
import { Base } from './base'

class BarChart extends Base {
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

		let intervalWidth = this.width/(this.data.length + 1);
		let barWidth = intervalWidth*0.4;
		let tickArray = linearTick(min(this.data), max(this.data));
		let minTick = min(tickArray);
		let maxTick = max(tickArray);

		let self = this;

		return this.data.map((item, index) => {
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

			return rect;
		}, this);
	}
}

export { BarChart }