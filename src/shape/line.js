import { Shape } from './shape';
import { max, min } from '../util/util';
import animation from '../util/easing';

class Line extends Shape {
	constructor({ pointArray, isDashed = false, style, groupId, zIndex }) {
		super({
			type: 'line',
			style: style,
			renderType: 'stroke',
			groupId: groupId,
			zIndex: zIndex
		});

		this.originalPointArray = pointArray;
		this.pointArray = pointArray.map(({ x, y }) => {
			return { x: x, y: y }
		});

		this.isDashed = isDashed;
	}

	buildPath(context) {
		let pointArray = this.pointArray.map(({ x, y }) => {
			return { x, y }
		});

		if(context.lineWidth === 1 && this.pointArray.length === 2) {
			let sp = this.pointArray[0];
			let ep = this.pointArray[1];

			// 竖线
			if(sp.x === ep.x && sp.x%1 !== 0.5) {
				let x = Math.round(sp.x) + 0.5;
				pointArray = [{ x: x, y: sp.y },{ x: x, y: ep.y }];
			}
			// 横线
			if(sp.y === ep.y && sp.y%1 !== 0.5) {
				let y = Math.round(sp.y) + 0.5;
				pointArray = [{ x: sp.x, y: y },{ x: ep.x, y: y }];
			}			
		}

		pointArray.forEach(({ x, y }, index, array) => {
			if(index === 0)
				context.moveTo(x, y);
			else {
				let pp = array[index - 1];

				// /* 对 1px 进行坐标对齐 */
				// if(context.lineWidth === 1) {
				// 	// 竖线
				// 	if(Math.round(pp.x) === Math.round(x)) {

				// 		x = pp.x = Math.round(pp.x) + 0.5;

				// 	}
				// 	// 横线
				// 	if(Math.round(pp.y) === Math.round(y)) {

				// 		y = pp.y = Math.round(pp.y) + 0.5;

				// 	}
				// }

				/* 虚线 */
				if(this.isDashed) {
				    let dashLen = 5;  
				    let dx = x - pp.x;
				    let dy = y - pp.y;
				    var num = Math.floor(Math.sqrt(Math.pow(dx, 2)+  Math.pow(dy, 2))/dashLen);

				    for(let i = 0; i < num; i++) {
				    	let _x = pp.x + (dx)/num*i;
				    	let _y = pp.y + (dy)/num*i;

				        context[i%2 == 0 ? 'moveTo' : 'lineTo'](_x, _y);  
				    } 

				    context.lineTo(x, y);
				}
				/* 实线 */
				else {
					context.lineTo(x, y);			
				}				
			}
		}, this);

	}
}

export { Line }