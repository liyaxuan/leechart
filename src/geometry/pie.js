import { linearTick, max, min, sum, unique, getCol, group } from '../util/util';
import { Line } from '../shape/line';
import { Sector } from '../shape/sector';
import { Geometry } from './geometry'

class PieChart extends Geometry {
	constructor({ data, dim, x, y, width, height, render, space, type = 'pie' }) {
		super({ data, dim, x, y, width, height, render, space });

		this.type = type;
	}

	computeShape() {
		let dim = this.dim;

		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let innerRadius = 0;
		let radius = Math.min(this.width, this.height)/2;
		let lastRadian = 3/2*Math.PI;

		let thetaData = unique(getCol(this.data, dim.theta));
		let colorData = dim.color ? unique(getCol(this.data, dim.color)) : null;
		let data = null;
		if(this.type === 'polar') {
			/* theta r color */
			if(dim.color && dim.color !== dim.theta)
				data = group(this.data, dim.r, dim.theta, dim.color);
			else
				data = group(this.data, dim.r, dim.theta).map((group) => group.slice(0, 1));
		}
		else {
			data = group(this.data, dim.theta, dim.color).map((group) => group.slice(0, 1));
		}

		let sumData = sum(data.reduce((pre, cur) => pre.concat(cur), []));
		let { minTick, maxTick } = this.computeTick(data.map(group => sum(group)), true);

		let shapeArray = [];

		data.forEach((group, groupIndex, array) => {

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

				let color = null;
				if(this.type === 'polar') {

					innerRadius = lastR;
					r = lastR + radius*(item - minTick)/(maxTick - minTick);
					color = this.color[index];
				}
				else {
					color = this.color[groupIndex];
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

				let obj = {};

				if(this.type === 'polar') {
					obj = {
						[dim.theta]: thetaData[groupIndex],
						[dim.r]: data[groupIndex][index]
					};
					if(colorData)
						obj[dim.color] = colorData[index]
				}
				else {
					obj = {
						[dim.color]: colorData[groupIndex],
						[dim.theta]: data[groupIndex][index]			
					};			
				}

				this.on(sector, obj);

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