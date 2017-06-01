import { max, min, linearTick } from '../util/util';
import { Line } from '../shape/line';
import { Circle } from '../shape/circle';
import { Polygon, RegularPolygon } from '../shape/polygon';
import { Text } from '../shape/text';

class ThetaAxis {
	constructor({ type = 'polar', thetaData, rData, x, y, width, height, tickCount = 5 }) {
		this.type = type;
		this.thetaData = thetaData;
		this.rData = rData;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		

		this.tickCount = tickCount;
	}

	computeShape() {

		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let r = Math.min(this.width, this.height)/2 - 2*12;

		let tickArray = linearTick(0, max(this.rData), this.tickCount);
		let shapeArray = [];
		this.thetaData.forEach((item, index, array) => {
			let interval = 2*Math.PI/array.length;

			let radian = 3/2*Math.PI + index*interval;

			let x = cx + r*Math.cos(radian);
			let y = cy + r*Math.sin(radian);

			shapeArray.push(new Line({
				pointArray: [{ x: cx, y: cy }, { x: x, y: y }],
				style: {
					lineWidth: 1,
					strokeStyle: '#d9d9d9'					
				},
				isDashed: true
			}));
			if(this.type === 'polar')
				radian += interval/2;
			let textX = cx + (r + 12)*Math.cos(radian);
			let textY = cy + (r + 12)*Math.sin(radian);

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

		let T = this.type === 'polar' ? Circle : RegularPolygon;

		tickArray.forEach((tick, index, array) => {
			shapeArray.push(new T({
				x: cx,
				y: cy,
				r: index*r/(array.length - 1),
				vertexNumber: this.thetaData.length,
				renderType: 'stroke',
				style: {
					lineWidth: 1,
					strokeStyle: index === array.length - 1 ? '#d9d9d9' : '#d9d9d9'
				}
			}));

			shapeArray.push(new Text({
				x: cx ,
				y: cy - index*r/(array.length - 1),
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
		return this.computeShape();
	}
}

export { ThetaAxis }