import { linearTick, sum, max, min, group, getCol, unique, } from '../util/util';
import { Rect } from '../shape/rect';
import { ToolTip } from '../tooltip/tooltip';
import { Geometry } from './geometry'

let margin = 6;

class BarChart extends Geometry {
	constructor({ data, color, x, y, width, height, render, space, isStacked = false, isBeginAtZero = false }) {
		super({ data, color, x, y, width, height, render, space });

		this.isStacked = isStacked;
		this.isBeginAtZero = isBeginAtZero
	}

	computeShape() {
		// let dim = this.dim;
		// let { xData, yData, colorData } = this.computeData();

		let space = this.space;
		let intervalWidth = (this.width - 2*space)/this.data.length;
		let areaWidth = 0.8*intervalWidth;
		let barWidth = (areaWidth - (this.data[0].length - 1)*margin)/this.data[0].length;
		if(this.isStacked)
			barWidth = areaWidth

		let { minTick, maxTick } = this.computeTick(this.data, this.isBeginAtZero);
		if(this.isStacked) {
			let result = this.computeTick(this.data.map(group => sum(group)), this.isBeginAtZero);
			maxTick = result.maxTick;
		}

		let shapeArray = this.data.map((group, groupIndex) => {

			let startX = this.x + space + groupIndex*intervalWidth + intervalWidth/2 - areaWidth/2;
			let heap = 0;
			let rectGroup = group.map((item, index) => {

				let x = startX + index*(barWidth + margin);
				let barHeight = this.height*(item - minTick)/(maxTick - minTick);
				let y = this.y + this.height - barHeight;
				let color = group.length === 1 ? this.color[groupIndex] : this.color[index]

				if(this.isStacked) {
					x = startX;
					y = this.y + this.height - heap - barHeight;
				}

				let rect = new Rect({
					x: x,
					y: y,
					width: barWidth,
					height: barHeight,
					style: {
						fillStyle: color
					},
					isAnimation: true
				});

				rect.init({ y: y + barHeight, height: 0 }).when(1000, { y: y, height: barHeight }).start();
				// this.on(rect, groupIndex, index);
				
				heap += barHeight; 
				return rect;
			}, this);

			return rectGroup;
		}, this);

		return shapeArray.reduce((pre, cur) => pre.concat(cur), []);
	}
}

export { BarChart }