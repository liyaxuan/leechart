import { max, min, linearTick } from '../util/util';
import { Line } from '../shape/line';
import { Circle } from '../shape/circle';
import { Text } from '../shape/text';

class PolarAxis {
	constructor({ thetaData, rData, x, y, width, height}) {
		this.thetaData = thetaData;
		this.rData = rData;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = Math.min(width, height)/2 - 2*12;
	}

	computeShape() {
		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let tickArray = linearTick(0, max(this.rData));
		let shapeArray = [];
		this.thetaData.forEach((item, index, array) => {
			let interval = 2*Math.PI/array.length;

			let radian = 3/2*Math.PI + index*interval;

			let x = cx + this.r*Math.cos(radian);
			let y = cy + this.r*Math.sin(radian);

			shapeArray.push(new Line({
				pointArray: [{ x: cx, y: cy }, { x: x, y: y }],
				style: {
					lineWidth: 1,
					strokeStyle: '#d9d9d9'					
				},
				isDashed: true
			}));

			radian += interval/2;
			let textX = cx + (this.r + 12)*Math.cos(radian);
			let textY = cy + (this.r + 12)*Math.sin(radian);

			shapeArray.push(new Text({
				x: textX,
				y: textY,
				value: item,
				rotate: 1/2*Math.PI + radian,
				style: {
					textAlign: 'center',
					textBaseline: 'bottom',	
					fillStyle: '#222222'	
				}
			}));
		});

		tickArray.forEach((tick, index, array) => {
			shapeArray.push(new Circle({
				x: cx,
				y: cy,
				r: index*this.r/(array.length - 1),
				renderType: 'stroke',
				style: {
					lineWidth: 1,
					strokeStyle: index === array.length - 1 ? '#d9d9d9' : '#d9d9d9'
				}
			}));

			shapeArray.push(new Text({
				x: cx ,
				y: cy - index*this.r/(array.length - 1),
				value: tick,
				style: {
					textAlign: 'center',
					textBaseline: 'middle'
				}
			}));
		}, this);

		return shapeArray;
	}

	getShape() {
		this.shapeArray = this.computeShape();
		return this.shapeArray;
	}
}

export { PolarAxis }