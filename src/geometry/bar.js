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
		let intervalWidth = this.width/(this.data.length + 1);

		let data = this.data.reduce((pre, cur) => pre.concat(cur), []);

		let tickArray = linearTick(min(data), max(data));
		let minTick = min(tickArray);
		let maxTick = max(tickArray);

		let self = this;

		let shapeArray = this.data.map((group, groupIndex) => {

			return group.map((item, index) => {
				let margin = 6;
				let groupWidth = intervalWidth*0.8;
				let barWidth = (groupWidth - (group.length - 1)*margin)/group.length;
				let barHeight = self.height*(item - minTick)/(maxTick - minTick);

				let x = self.x + (groupIndex + 1)*intervalWidth - groupWidth/2 + index*(barWidth + margin);
				let y = self.y + self.height - barHeight;

				let rect = new Rect({
					x: x,
					y: y,
					width: barWidth,
					height: barHeight,
					style: {
						fillStyle: self.color[index]
					},
					isAnimation: true
				});

				return rect;
			});
		});

		return shapeArray;
	}
}

export { BarChart }