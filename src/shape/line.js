import { Shape } from './shape';
import { max, min } from '../util/util';
import animation from '../util/easing';

class Line extends Shape {
	constructor({ pointArray, isDashed = false, style, groupId, zIndex, isAnimation }) {
		super({
			type: 'line',
			style: style,
			renderType: 'stroke',
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.originalPointArray = pointArray;
		this.pointArray = pointArray.map(({ x, y }) => {
			return { x: x, y: y }
		});
		this.isDashed = isDashed;
	}

	animate(currentTime, duration) {
		let yArray = this.originalPointArray.map(({ x, y }) => y);
		let maxY = max(yArray);

		this.pointArray = this.originalPointArray.map(({ x, y }) => {
			let dY = Math.abs(maxY - y);
			let currentY = maxY - animation.easeInCubic(null, currentTime, 0, dY, duration);
			return {
				x: x,
				y: Math.max(currentY, y)
			};
		});
	}

	buildPath(context) {
		context.beginPath();
		
		if(context.lineWidth === 1) 
			for(let i = 0, p = this.pointArray[i], np = this.pointArray[i + 1]; i < this.pointArray.length - 1; i++) {
				// 竖线
				if(Math.round(p.x) === Math.round(np.x)) {
					p.x = np.x = Math.round(np.x) + 0.5;
				}
				// 横线
				if(Math.round(p.y) === Math.round(np.y)) {
					p.y = np.y = Math.round(np.y) + 0.5;
				}				
			}

		this.pointArray.forEach(({ x, y }, index, array) => {
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

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}
}

export { Line }