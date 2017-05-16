import { Shape } from './shape';

class RoundRect extends Shape {
	constructor({ x, y, width, height, r, style, renderType, groupId, zIndex }) {
		super({
			type: 'round-rect',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = r;
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}

	buildPath(context) {
		context.beginPath();

		context.arc(this.x + this.r, this.y + this.r, this.r, Math.PI, 3/2*Math.PI);
		context.lineTo(this.x + this.width - this.r, this.y);

		context.arc(this.x + this.width - this.r, this.y + this.r, this.r, 3/2*Math.PI, 2*Math.PI);
		context.lineTo(this.x + this.width, this.y + this.height - this.r);

		context.arc(this.x + this.width - this.r, this.y + this.height - this.r, this.r, 0, Math.PI/2);
		context.lineTo(this.x + this.r, this.y + this.height);

		context.arc(this.x + this.r, this.y + this.height - this.r, this.r, Math.PI/2, Math.PI);

		context.closePath();
	}
}

export { RoundRect }