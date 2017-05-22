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
		this.vertexArray.forEach(function (vertex) {
			context.lineTo(vertex.x, vertex.y);
		}, this);
		context.lineTo(this.vertexArray[0].x, this.vertexArray[0].y);
	}
}

class RegularPolygon extends Polygon {
	constructor({ x, y, r, vertexNumber, style, renderType }) {
		super({
			vertexArray: new Array(vertexNumber).fill(0).map(function (item, index) {
				let radian = 2*Math.PI/vertexNumber;
				return {
					x: x + r*Math.cos(Math.PI/2 - index*radian),
					y: y - r*Math.sin(Math.PI/2 - index*radian)
				}
			}),
			style: style,
			renderType: renderType
		});
	}
}

export { Polygon, RegularPolygon }