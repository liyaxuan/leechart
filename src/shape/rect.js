import { Shape } from './shape';
import animation from '../util/easing';

class Rect extends Shape {
	constructor({ x, y, width, height, style, renderType, groupId, zIndex }) {
		super({
			type: 'rect',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		this.x = x;
		this.originalY = y;
		this.y = y;
		this.width = width;
		this.originalHeight = height;
		this.height = height;
	}

	buildPath(context) {
		context.rect(this.x, this.y, this.width, this.height);		
	}
}

export { Rect }