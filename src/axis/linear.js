import { max, min, linearTick, getTextBoundingRect } from '../util/util';
import { Line } from '../shape/line';
import { Text } from '../shape/text';

class LinearAxis {
	constructor({ data, type = 'linear', chartType, x = 0, y = 0, width, height, bodyHeight, bodyWidth, position = 'left', space = 0, isBeginAtZero = false, isGrid = true, isReverse = false, render }) {
		this.data = data;
		/* 数据相关的 */

		this.type = type;
		this.chartType = chartType;
		/* 位置相关 */
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.position = position;
		this.space = space;
		this.isGrid = isGrid;
		this.isBeginAtZero = isBeginAtZero;
		this.isReverse = isReverse;

		this.bodyWidth = bodyWidth;
		this.bodyHeight = bodyHeight;
	
		this.render = render;
	}

	/* 有 data 就可以计算 tick, 不受文本 rotate 的影响 */
	computeTick() {
		let tickArray = [];

		if(this.type === 'linear') {
			tickArray = linearTick(min(this.data), max(this.data));

			if(this.isZero && tickArray[0] > 0)
				tickArray.unshift(0);
		}
		else if(this.type === 'category') {
			tickArray = this.data.slice(0);
		}

		let length = 0;
		if(/top|bottom/.test(this.position))
			length = this.width;
		else if(/left|right/.test(this.position))
			length = this.height;

		return tickArray.map((tick, index, array) => {
			let position = 0;

			if(this.type === 'category') {
				if(this.chartType === 'bar') {
					let intervalWidth = (length - 2*this.space)/array.length;

					position = this.space + intervalWidth/2 + index*intervalWidth;							
				}
				else {
					let intervalWidth = (length - 2*this.space)/(array.length - 1);
					position = this.space + index*intervalWidth;
				}
			}

			else if(this.type === 'linear') {
				let intervalWidth = (length - 2*this.space)/(array.length - 1);
				position = this.space + index*intervalWidth
			}

			if(this.isReverse)
				position = length - position;

			return {
				value: tick,
				position: position
			};
		}, this);
	}

	/* 计算 label 的旋转 */
	fit() {
		let tickArray = this.computeTick();
		let context = this.render.getContext();

		let limitedLabelWidth = 0;
		let maxLabelWidth = max(tickArray.map(tick => context.measureText(tick.value).width ));
		
		/* 水平坐标轴的限制在于宽度 */
		if(/top|bottom/.test(this.position)) {
			let rotate = 0;
			
			let textAlign = 'center';
			let textBaseline = 'top';

			/* 先处理宽度, 计算 rotate */
			let leftWidth = this.width;
			if(this.isSpace) {
				/* 剔除了两端的距离, 将剩下的部分平分 */
				leftWidth = this.width - this.width/(tickArray.length + 1)
			}
			/* 设刻度之间的最小距离为4 */
			limitedLabelWidth = (leftWidth - 4*(tickArray.length - 1))/tickArray.length;

			if(maxLabelWidth > limitedLabelWidth) {
				rotate = Math.acos(limitedLabelWidth/maxLabelWidth);
				textAlign = 'right';
			}
			this.rotate = rotate;

			/* 接下来处理高度, 根据需要进行拓高 */
			let height = tickArray.reduce(function (pre, cur) {
				/* 每个在 rotate 角度下旋转的文本 */
				let { height } = getTextBoundingRect({
					context: context,
					text: cur.value,
					rotate: rotate,
					fontSize: 12,
					textAlign:textAlign,
					textBaseLine: textBaseline
				});

				return Math.max(pre, height);
			}, 0);
			let preHeight = this.height;
			this.height = Math.max(preHeight, height + 12);
		}
		/* 竖直坐标轴的限制在于宽度, 不旋转直接拓宽 */
		else if(/left|right/.test(this.position)) {
			this.rotate = 0;
			let preWidth = this.width;
			this.width = Math.max(this.width, maxLabelWidth + 12);
		}
	}

	computeShape() {
		let tickArray = this.computeTick();
		let lineStyle = {
			strokeStyle: '#d9d9d9',
			lineWidth: 1
		};

		let shapeArray = [];
		/* 水平坐标轴 */
		if(/top|bottom/.test(this.position)) {
			/* 轴线 */
			let sx = this.x;
			let sy = this.y;
			let ex = this.x + this.width;
			let ey = sy;
			if(this.position === 'top') {
				ey = sy = this.y + this.height;
			}

			shapeArray.push(new Line({
				pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
				style: lineStyle,
				zIndex: 1
			}));

			tickArray.forEach((tick) => {
				let sx = this.x + tick.position;
				let sy = this.y;

				let ex = sx;
				let ey = sy + 8;
				if(this.position === 'top') {
					sy = this.y + this.height;
					ey = sy - 8;
				}
					
				/* 刻度线 */
				shapeArray.push(new Line({
					pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
					style: lineStyle,
				}));

				/* label */


				shapeArray.push(new Text({
					x: sx,
					y: this.position === 'bottom' ? sy + 12 : sy - 12,
					value: tick.value,
					style: {
						textBaseline: this.position === 'bottom' ? 'top' : 'bottom',
						textAlign: this.rotate === 0 ? 'center' : 'right'						
					},
					rotate: -1*this.rotate,
				}));
			}, this);

			/* 网格 */
			if(this.isGrid) {
				let gridArray = tickArray;
				if(this.space !== 0)
					gridArray = [{ value: '', position: 0 }].concat(gridArray).concat({
						value: '',
						position: this.width
					});

				gridArray.forEach((tick) => {
					let sx = this.x + tick.position;
					let sy = this.y;
					let ex = sx;
					let ey = sy - this.bodyHeight;
					if(this.position === 'top') {
						sy = this.y + this.height;
						ey = sy + this.bodyHeight;
					}

					shapeArray.push(new Line({
						pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
						style: lineStyle,
						isDashed: true
					}));
				}, this);				
			}
		}
		/* 竖直坐标轴 */
		else if(/left|right/.test(this.position)) {
			let sx = this.x + this.width;
			let sy = this.y + this.height;
			let ex = sx;
			let ey = this.y;
			if(this.position === 'right') {
				ex = sx = this.x;
			}

			shapeArray.push(new Line({
				pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
				style: lineStyle,
				zIndex: 1
			}));

			tickArray.forEach((tick, index) => {
				let sx = this.x + this.width;
				let sy = this.y + this.height - tick.position;
				let ex = sx - 8;
				let ey = sy;
				if(this.position === 'right') {
					sx = this.x;
					ex = this.x + 8;
				}

				shapeArray.push(new Line({
					pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
					style: lineStyle
				}));

				let tsx = this.x + this.width - 12;
				let tsy = this.y + this.height - tick.position;
				if(this.position === 'right') {
					tsx = this.x + 12;
				}

				let textAlign = this.position === 'left' ? 'right' : 'left'

				shapeArray.push(new Text({
					x: tsx,
					y: tsy,
					value: tick.value,
					style: {
						textBaseline: 'middle',
						textAlign: textAlign
					},
					rotate: this.rotate					
				}));
			}, this);

			if(this.isGrid) {
				let gridArray = tickArray;
				if(this.space !== 0)
					gridArray = [{ value: '', position: 0 }].concat(gridArray).concat({
						value: '',
						position: this.height
					});

				gridArray.forEach((tick) => {
					let sx = this.x + this.width;
					let sy = this.y + this.height - tick.position;
					let ex = sx + this.bodyWidth;
					let ey = sy;
					if(this.position === 'right') {
						sx = this.x;
						ex = sx - this.bodyWidth
					}

					shapeArray.push(new Line({
						pointArray: [{ x: sx, y: sy }, { x: ex, y: ey }],
						style: lineStyle,
						isDashed: true
					}));
				}, this);				
			}
		}

		return shapeArray;
	}

	getWidth() {
		this.fit();
		return this.width;
	}

	getHeight() {
		this.fit();
		return this.height;
	}

	getShape() {
		this.fit();
		return this.computeShape();		
	}
}

export { LinearAxis }