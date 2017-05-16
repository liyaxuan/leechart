import { Shape } from './shape';

class Polygon extends Shape {
	constructor({ vertexArray, style, renderType, groupId, zIndex }) {
		super({
			type: 'polygon',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		this.vertexArray = vertexArray;
	}

	buildPath(context) {
		context.beginPath();
		this.vertexArray.forEach(function (vertex) {
			context.lineTo(vertext.x, vertex.y);
		}, this);
		context.closePath();
	}

	isPointIn(context, x, y) {
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}
}

class RegularPolygon extends Polygon {
	constructor({ x, y, r, vertexNumber, style, renderType }) {
		super({
			vertexArray: new Array(this.vertexNumber).fill(0).map(function (item, index) {
				let radian = 2*Math.PI/this.vertexNumber;
				return {
					x: this.x + r*Math.cos(Math.PI/2 - index*radian),
					y: this.y - r*Math.sin(Math.PI/2 - index*radian)
				}
			}, this),
			style: style,
			renderType: renderType
		});
	}
}

export { Polygon, RegularPolygon }