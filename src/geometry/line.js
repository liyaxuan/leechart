import { linearTick, max, min, sum } from '../util/util';
import { Circle } from '../shape/circle';
import { Line } from '../shape/line';
import { BezierCurve } from '../shape/bezier-curve';
import { Polygon } from '../shape/polygon';
import { CustomShape } from '../shape/custom-shape';
import { Geometry } from './geometry'

class LineChart extends Geometry {
	constructor({ data, color, x, y, width, height, render, space, isBezierCurve = true, isArea = true, isStacked = false, isBeginAtZero = false }) {
		super({ data, color, x, y, width, height, render, space });

		this.isBezierCurve = isBezierCurve;
		this.isArea = isArea;
		this.isBeginAtZero = isBeginAtZero;
	}

	computeShape() {


		let space = this.space;
		let intervalWidth = (this.width - 2*space)/(this.data.length - 1);

		let { minTick, maxTick } = this.computeTick(this.data, this.isBeginAtZero);
		if(this.isStacked)
			maxTick = this.computeTick(this.data.map(group => sum(group)), this.isBeginAtZero);

		let T = this.isBezierCurve ? BezierCurve : Line;

		let shapeArray = [];
		let pointGroup = [];

		this.data.forEach((group, groupIndex) => {

			group.forEach((item, index) => {
				let x = this.x + space + groupIndex*intervalWidth;
				let pointHeight = this.height*(item - minTick)/(maxTick - minTick);
				let y = this.y + this.height - pointHeight;

				let circle = new Circle({
					x: x,
					y: y,
					r: 3,
					style: {
						fillStyle: '#ffffff',
						strokeStyle: this.color[index],
						lineWidth: 2
					},
					renderType: 'fillstroke',
					zIndex: 2,
					isAnimation: true
				});

				shapeArray.push(circle);

				pointGroup[index] = pointGroup[index] || [];
				pointGroup[index].push({ x, y });
			}, this);
		}, this);

		pointGroup.forEach((array, index) => {
			let maxY = max(array.map(({ x, y }) => y));

			let line = new T({
				pointArray: array,
				style: {
					strokeStyle: this.color[index],
					lineWidth: 2,
				},
				zIndex: 1,
				isAnimation: true			
			});

			line.init({
				pointArray: array.map(({ x, y }) => {
					return { x: x, y: maxY }
				})
			}).when(1000, {
				pointArray: array
			}).start();

			shapeArray.push(line);

			if(this.isArea) {
				let minX = array[0].x;					
				let maxX = array[array.length - 1].x;
				let y = this.y + this.height;


				if(this.isBezierCurve) {

					let area = new CustomShape({
						config: {
							sx: minX,
							sy: y,
							ex: maxX,
							ey: y,
							bezierArray: array							
						},
			
						renderType: 'fill',
						style: {
							fillStyle: this.color[index],
							globalAlpha: 0.5
						},
						zIndex: 0,
						buildPath: function (context) {
							context.moveTo(this.sx, this.sy);
							this.bezierArray.forEach(({ x, y }, index, array) => {
								if(index === 0)
									context.lineTo(x, y);
								else {
									let midX = (array[index - 1].x + x)/2;
									let preY = array[index - 1].y;
									context.bezierCurveTo(midX, preY, midX, y, x, y);
								}
							});	
							context.lineTo(this.ex, this.ey);

							context.closePath();							
						}
					});

					area.init({
						sx: minX,
						y: y,
						ex: maxX,
						ey: y,
						bezierArray: array.map(({ x }) => {
							return { x: x, y: y }
						})
					}).when(1000, {
						sx: minX,
						y: y,
						ex: maxX,
						ey: y,
						bezierArray: array.map(({ x, y }) => {
							return { x: x, y: y }
						})			
					}).start();

					shapeArray.push(area);
				}
				else {
					let vertexArray = array.map(({ x, y }) => {
						return { x, y };
					});
					vertexArray.unshift({ x: minX, y: y })
					vertexArray.push({ x: maxX, y: y })
					vertexArray.push({ x: minX, y: y });

					let polygon = new Polygon({
						vertexArray: vertexArray,
						renderType: 'fill',
						style: {
							fillStyle: this.color[index],
							globalAlpha: 0.50
						},
						zIndex: 0
					});

					polygon.init({
						vertexArray: [{ x: minX, y: y }].concat(array.map(({ x }) => {
							return { x, y }
						})).concat([{ x: maxX, y: y }, { x: minX, y: y }])
					}).when(1000, {
						vertexArray: vertexArray.map(({ x, y }) => {
							return { x, y }
						})
					}).start();

					shapeArray.push(polygon);
				}
			}
		}, this);


		return shapeArray;
	}
}

export { LineChart }