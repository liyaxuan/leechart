import { Shape } from './shape';
import { max, min } from '../util/util';
import animation from '../util/easing';

class BezierCurve extends Shape {
	constructor({ pointArray, style, groupId, zIndex }) {
		super({
			type: 'bezier-curve',
			style: style,
			renderType: 'stroke',
			groupId: groupId,
			zIndex: zIndex
		});

		this.originalPointArray = pointArray;
		this.pointArray = pointArray.map(({ x, y }) => {
			return { x: x, y: y }
		});
	}

	buildPath(context) {
		this.pointArray.forEach(({ x, y }, index, array) => {
			if(index === 0)
				context.moveTo(x, y);
			else {
				let midX = (array[index - 1].x + x)/2;
				let preY = array[index - 1].y;
				context.bezierCurveTo(midX, preY, midX, y, x, y);
			}
		});
	}	
}

export { BezierCurve }