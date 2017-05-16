import { Shape } from './shape';
import { max, min } from '../util/util';
import animation from '../util/easing';

class BezierCurve extends Shape {
	constructor({ pointArray, style, groupId, zIndex, isAnimation }) {
		super({
			type: 'bezier-curve',
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
	}

	buildPath(context) {
		context.beginPath();

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

	animate(currentTime, duration) {
		let yArray = this.originalPointArray.map(({ x, y }) => y);
		let maxY = max(yArray);

		this.pointArray = this.originalPointArray.map(({ x, y }) => {
			let dY = Math.abs(maxY - y);
			let currentY = maxY - animation.easeInCubic(null, currentTime, 0, dY, duration);
			return {
				x: x,
				y: Math.max(y, currentY)
			};
		});
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}	
}

export { BezierCurve }