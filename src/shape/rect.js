import { Shape } from './shape';
import animation from '../util/easing';

class Rect extends Shape {
	constructor({ x, y, width, height, style, renderType, groupId, zIndex, isAnimation }) {
		super({
			type: 'rect',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.x = x;
		this.originalY = y;
		this.y = y;
		this.width = width;
		this.originalHeight = height;
		this.height = height;
	}

	buildPath(context) {
		context.beginPath();
		context.rect(this.x, this.y, this.width, this.height);		
	}

	animate(currentTime, duration) {
		let currentHeight = animation.easeInCubic(null, currentTime, 0, this.originalHeight, duration);
		this.height = Math.min(currentHeight, this.originalHeight);
		this.y = this.originalY + this.originalHeight - this.height;
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}
}

export { Rect }