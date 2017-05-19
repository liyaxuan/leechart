import { linearTick, max, min, group, getCol, unique, } from '../util/util';
import { Rect } from '../shape/rect';
import { ToolTip } from '../tooltip/tooltip';
import { Geometry } from './geometry'

let margin = 6;

class BarChart extends Geometry {
	constructor({ data, dim, x, y, width, height, render, space, isStacked = false }) {
		super({
			data: data,
			dim: dim,
			x: x,
			y: y,
			width: width,
			height: height,
			render: render,
			space: space
		});

		this.isStacked = isStacked;
	}

	computeShape() {
		let dim = this.dim;
		let { xData, yData, colorData } = this.computeData();

		let space = this.space;
		let intervalWidth = (this.width - 2*space)/yData.length;
		let areaWidth = 0.8*intervalWidth;
		let barWidth = (areaWidth - (yData[0].length - 1)*margin)/yData[0].length;

		let { minTick, maxTick } = this.computeTick(yData);

		let shapeArray = yData.map((group, groupIndex) => {

			let startX = this.x + space + groupIndex*intervalWidth + intervalWidth/2 - areaWidth/2;

			return group.map((item, index) => {

				let x = startX + index*(barWidth + margin);
				let barHeight = this.height*(item - minTick)/(maxTick - minTick);
				let y = this.y + this.height - barHeight;
				let color = dim.color ? this.color[index] : this.color[groupIndex]

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

				let obj = {
					[dim.x]: xData[groupIndex],
					[dim.y]: yData[groupIndex][index]			
				};
				if(colorData)
					obj[dim.color] = colorData[index];

				this.on(rect, obj);

				return rect;
			}, this);
		}, this);

		return shapeArray.reduce((pre, cur) => pre.concat(cur), []);
	}
}

export { BarChart }