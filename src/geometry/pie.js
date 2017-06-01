import { linearTick, max, min, sum, unique, getCol, group } from '../util/util';
import { Line } from '../shape/line';
import { Sector } from '../shape/sector';
import { Geometry } from './geometry'

class PieChart extends Geometry {
	constructor({ data, color, x, y, width, height, render, space, type = 'pie' }) {
		super({ data, color, x, y, width, height, render, space });

		this.type = type;
	}

	computeShape() {
		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let innerRadius = 0;
		let radius = Math.min(this.width, this.height)/2;
		let lastRadian = 3/2*Math.PI;

		let sumData = sum(this.data.reduce((pre, cur) => pre.concat(cur), []));
		let { minTick, maxTick } = this.computeTick(this.data.map(group => sum(group)), true);

		let shapeArray = [];

		this.data.forEach((group, groupIndex, array) => {

			let radian = 0;
			let r = 0;
			if(this.type === 'polar') {
				radian = 2*Math.PI/array.length;
			}
			else {
				innerRadius = this.type === 'doughnut' ? (0.5*radius) : 0;
				r = radius;
			}

			let lastR = 0;
			group.forEach((item, index, array) => {

				let color = group.length === 1 ? this.color[groupIndex] : this.color[index];
				if(this.type === 'polar') {

					innerRadius = lastR;
					r = lastR + radius*(item - minTick)/(maxTick - minTick);
				}
				else {
					radian = 2*Math.PI*item/sumData;
				}
					
				let sector = new Sector({
					x: cx,
					y: cy,
					innerRadius: innerRadius,
					outerRadius: r,
					startRadian: lastRadian,
					endRadian: lastRadian + radian,
					renderType: 'fillstroke',
					style: {
						fillStyle: color,
						strokeStyle: '#ffffff',
						lineWidth: 2
					},
					zIndex: 0,
					isAnimation: true
				});

				sector.init({
					startRadian: 0,
					endRadian: 0
				}).when(1000, {
					startRadian: lastRadian,
					endRadian: lastRadian + radian
				}).start();

				lastR = r;

				shapeArray.push(sector);		
			}, this);

			lastRadian = lastRadian + radian;
		}, this);

		return shapeArray;
	}
}

export { PieChart }