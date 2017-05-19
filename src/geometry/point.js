import { linearTick, max, min } from '../util/util';
import { Circle } from '../shape/circle';
import { Geometry } from './geometry'

class PointChart extends Geometry {
	constructor({ data, dim, x, y, width, height, render, space }) {
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
	}
	
	computeShape() {
		let dim = this.dim;
		let { xData, yData, colorData } = this.computeData();

		let intervalWidth = (this.width - 2*this.space)/(yData.length - 1);

		let { minTick, maxTick } = this.computeTick(yData);

		return yData.map((group, groupIndex) => {
			return group.map((item, index) => {
				let x = this.x + this.space + groupIndex*intervalWidth;

				let pointHeight = this.height*(item - minTick)/(maxTick - minTick);
				let y = this.y + this.height - pointHeight;

				let r = 6 + 18*(item - minTick)/(maxTick - minTick);

				let circle = new Circle({
					x: x,
					y: y,
					r: r,
					renderType: 'fill',
					style: {
						fillStyle: this.color[index],
						globalAlpha: 0.5
					},
					isAnimation: true
				});

				let obj = {
					[dim.x]: xData[groupIndex],
					[dim.y]: yData[groupIndex][index]			
				};
				if(colorData)
					obj[dim.color] = colorData[index];

				this.on(circle, obj);

				return circle;
			}, this);
		}, this).reduce((pre, cur) => pre.concat(cur), []);
	}
}

export { PointChart }