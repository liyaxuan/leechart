import { linearTick, max, min, sum } from '../util/util';
import { Line } from '../shape/line';
import { Sector } from '../shape/sector';
import { Base } from './base'

class PieChart extends Base {
	constructor({ data, x, y, width, height, render, type = 'polar' }) {
		super({
			data: data,
			x: x,
			y: y,
			width: width,
			height: height,
			render: render
		});

		this.type = type;
	}

	computeShape() {
		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let sumData = sum(this.data);
		let maxData = max(this.data);

		let radius = min([this.width, this.height])/2;
		let lastRadian = 0;
		let color = this.color;

		return this.data.map(function (item, index, array) {
			let radian = 2*Math.PI*item/sumData;
			let r = radius;

			if(this.type === 'polar') {
				radian = 2*Math.PI/array.length;
				r = radius*(item/maxData);
			}

			return new Sector({
				x: cx,
				y: cy,
				innerRadius: 0,
				outerRadius: r,
				startRadian: lastRadian,
				endRadian: lastRadian += radian,
				renderType: 'fillstroke',
				style: {
					fillStyle: color[index],
					strokeStyle: '#ffffff',
					lineWidth: 4
				},
				zIndex: 0,
				isAnimation: true
			});
		}, this);
	}
}

export { PieChart }