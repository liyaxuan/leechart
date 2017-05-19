import { linearTick, max, min } from '../util/util';
import { Circle } from '../shape/circle';
import { Line } from '../shape/line';
import { BezierCurve } from '../shape/bezier-curve';
import { Geometry } from './geometry'

class LineChart extends Geometry {
	constructor({ data, dim, x, y, width, height, render, space, isBezierCurve = true, isArea = true }) {
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

		this.isBezierCurve = isBezierCurve;
		this.isArea = isArea;
	}

	computeShape() {
		let dim = this.dim;
		let { xData, yData, colorData } = this.computeData();

		let space = this.space;
		let intervalWidth = (this.width - 2*space)/(yData.length - 1);

		let { minTick, maxTick } = this.computeTick(yData);

		let T = this.isBezierCurve ? BezierCurve : Line;

		let shapeArray = [];
		let pointArray = [];

		yData.forEach((group, groupIndex) => {
			group.forEach((item, index) => {
				let x = this.x + space + groupIndex*intervalWidth;
				let pointHeight = this.height*(item - minTick)/(maxTick - minTick);
				let y = this.y + this.height - pointHeight;

				let circle = new Circle({
					x: x,
					y: y,
					r: 3,
					style: {
						fillStyle: '#ffffff',
						strokeStyle: this.color[index],
						lineWidth: 2
					},
					renderType: 'fillstroke',
					zIndex: 2,
					isAnimation: true
				});

				let obj = {
					[dim.x]: xData[groupIndex],
					[dim.y]: yData[groupIndex][index]			
				};
				if(colorData)
					obj[dim.color] = colorData[index];

				this.on(circle, obj);

				shapeArray.push(circle);

				pointArray[index] = pointArray[index] || [];
				pointArray[index].push({ x, y });
			}, this);
		}, this);

		pointArray.forEach((item, index) => {
			let line = new T({
				pointArray: item,
				style: {
					strokeStyle: this.color[index],
					lineWidth: 2,
				},
				zIndex: 1,
				isAnimation: true			
			});

			shapeArray.push(line);
		}, this);

		return shapeArray;
	}
}

export { LineChart }