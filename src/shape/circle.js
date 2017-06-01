import { Shape } from './shape';
import animation from '../util/easing';

class Circle extends Shape {
	constructor({ x, y, r, style, renderType, groupId, zIndex }) {
		super({
			type: 'circle',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		this.x = x;
		this.y = y;
		this.originalR = r;
		this.r = r;
	}

	buildPath(context) {
		context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
	}
}

export { Circle };