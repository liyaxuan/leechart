import { Shape } from './shape';
import animation from '../util/easing';

class Circle extends Shape {
	constructor({ x, y, r, style, renderType, groupId, zIndex, isAnimation }) {
		super({
			type: 'circle',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.x = x;
		this.y = y;
		this.originalR = r;
		this.r = r;
	}

	animate(currentTime, duration) {
		let currentR = animation.easeInCubic(null, currentTime, 0, this.originalR, duration);
		this.r = Math.min(currentR, this.originalR);
	}

	buildPath(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}
}

export { Circle };