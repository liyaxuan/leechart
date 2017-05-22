import { group } from '../util/util';
import { Polygon } from '../shape/polygon';
import { Circle } from '../shape/circle';
import { Geometry } from './geometry';

class RadarChart extends Geometry {
	constructor({ data, dim, x, y, width, height, render, space }) {
		super({ data, dim, x, y, width, height, render, space });
	}

	computeShape() {
		let dim = this.dim;
		let rData = group(this.data, dim.r, dim.theta, dim.color);
		if(!dim.color || dim.color === dim.theta)
			rData = rData.map(group => group.slice(0, 1));

		let { minTick, maxTick } = this.computeTick(rData, true);
		let shapeArray = [];
		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let r = Math.min(this.width, this.height)/2;
		let vertexArray = [];
		rData.forEach((group, groupIndex, array) => {
			let interval = 2*Math.PI/array.length;
			let radian = 3/2*Math.PI + groupIndex*interval;

			group.forEach((item, index) => {

				vertexArray[index] = vertexArray[index] || [];
				let _r = r*(item - minTick)/(maxTick - minTick);
				let x = cx + _r*Math.cos(radian);
				let y = cy + _r*Math.sin(radian);
				shapeArray.push(new Circle({
					x: x,
					y: y,
					r: 2,
					style: {
						fillStyle: this.color[index],
						renderType: 'fill'
					}
				}))
				vertexArray[index].push({ x, y });
			}, this);
		}, this);

		vertexArray.forEach((group, index) => {
			let polygon = new Polygon({
				vertexArray: group,
				style: {
					strokeStyle: this.color[index],
					fillStyle: this.color[index],
					lineWidth: 2,
					globalAlpha: 0.4
				},
				renderType: 'fillstroke'
			});

			polygon.init({
				vertexArray: group.map(vertex => {
					return { x: cx, y: cy }
				})
			}).when(1000, {
				vertexArray: group
			}).start();

			shapeArray.push(polygon);
		}, this);

		return shapeArray;
	}

	getShape() {
		return this.computeShape();
	}
}

export { RadarChart }