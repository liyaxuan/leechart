import { Shape } from './shape';
import animation from '../util/easing';

class Sector extends Shape {
	constructor({ x, y, innerRadius, outerRadius, startRadian, endRadian, style, renderType, groupId, zIndex, isAnimation }) {
		super({
			type: 'sector',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.x = x;
		this.y = y;
		this.innerRadius = innerRadius;
		this.outerRadius = outerRadius;

		this.originalStartRadian = startRadian;
		this.startRadian = startRadian;

		this.originalEndRadian = endRadian;
		this.endRadian = endRadian;

	}

	animate(currentTime, duration) {
		let currentStartRadian = animation.easeOutBounce(null, currentTime, 0, this.originalStartRadian, duration);
		let currentEndRadian = animation.easeOutBounce(null, currentTime, 0, this.originalEndRadian, duration);
		this.endRadian = Math.min(currentEndRadian, this.originalEndRadian);
		this.startRadian = Math.min(currentStartRadian, this.originalStartRadian);
	}

	buildPath(context) {
		context.beginPath();

		context.moveTo(this.x + this.innerRadius*Math.cos(this.startRadian),
			this.y + this.innerRadius*Math.sin(this.startRadian));
		context.lineTo(this.x + this.outerRadius*Math.cos(this.startRadian),
			this.y + this.outerRadius*Math.sin(this.startRadian));

		context.arc(this.x, this.y, this.outerRadius, this.startRadian, this.endRadian, false);

		context.lineTo(this.x + this.innerRadius*Math.cos(this.endRadian),
			this.y + this.innerRadius*Math.sin(this.endRadian));

		context.arc(this.x, this.y, this.innerRadius, this.endRadian, this.startRadian, true);
		context.closePath();
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}
}

export { Sector }