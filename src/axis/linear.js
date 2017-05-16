import { max, min, linearTick, getTextBoundingRect } from '../util/util';
import { Line } from '../shape/line';
import { Text } from '../shape/text';

class LinearAxis {
	constructor({ data, x, y, width, length, bodyHeight, bodyWidth, position = 'left', isSpace = false, isGrid = true, context }) {
		this.data = data;
		/* 数据相关的 */
		if(typeof this.data[0] === 'number') {
			this.dataType = 'linear';
		}
		else if(typeof this.data[0] === 'string') {
			this.dataType = 'category';
		}

		/* 位置相关 */
		this.x = x;
		this.y = y;
		this.width = width;
		this.length = length;
		this.position = position;
		this.isSpace = isSpace;
		this.isGrid = isGrid;

		this.bodyWidth = bodyWidth;
		this.bodyHeight = bodyHeight;
	
		this.context = context;

		this.update();
	}

	update() {
		this.tickArray = this.computeTick();
		this.fit();
		this.shapeArray = this.computeShape();		
	}

	/* 有 data 就可以计算 tick, 不受文本 rotate 的影响 */
	computeTick() {
		let tickArray = [];

		if(this.dataType === 'linear') {
			tickArray = linearTick(min(this.data), max(this.data));
		}
		else if(this.dataType === 'category') {
			tickArray = this.data.slice(0);
		}

		return tickArray.map((tick, index, array) => {
			let position = 0;

			if(this.isSpace)
				position = (index + 1)*this.length/(array.length + 1);
			else
				position = index*this.length/(array.length - 1);

			return {
				value: tick,
				position: position
			};
		}, this);
	}

	/* 计算 label 的旋转 */
	fit() {
		let context = this.context;

		let limitedLabelWidth = 0;
		let maxLabelWidth = max(this.tickArray.map(tick => context.measureText(tick.value).width ));

		
		/* 水平坐标轴的限制在于长度 */
		if(this.position === 'top' || this.position === 'bottom') {
			let rotate = 0;
			
			let textAlign = 'center';
			let textBaseline = 'top';

			/* 先计算 rotate */
			let leftLength = this.length;
			if(this.isSpace) {
				/* 剔除了两端的距离, 将剩下的部分平分 */
				leftLength = this.length - this.length/(this.tickArray.length + 1)
			}
			/* 设刻度之间的最小距离为4 */
			limitedLabelWidth = (leftLength - 4*(this.tickArray.length - 1))/this.tickArray.length;

			if(maxLabelWidth > limitedLabelWidth) {
				rotate = Math.acos(limitedLabelWidth/maxLabelWidth);
				textAlign = 'right';
			}
			this.rotate = rotate;

			/* 接下来处理宽度 */
			let width = this.tickArray.reduce(function (pre, cur) {
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
			let preWidth = this.width;
			this.width = Math.max(preWidth, width + 12);
			if(this.position === 'bottom')
				this.y -= (this.width - preWidth);

			this.bodyHeight -= (this.width - preWidth);
		}
		/* 竖直坐标轴的限制在于宽度, 不旋转直接拓宽 */
		else if(this.position === 'left' || this.position === 'right') {
			this.rotate = 0;
			let preWidth = this.width;
			this.width = Math.max(this.width, maxLabelWidth + 12);
			if(this.position === 'right')
				this.x -= (this.width - preWidth);

			this.bodyWidth -= (this.width - preWidth);
		}
	}

	computeShape() {
		let lineStyle = {
			strokeStyle: '#d9d9d9',
			lineWidth: 1
		};

		let shapeArray = [];
		/* 水平坐标轴 */
		if(this.position === 'top' || this.position === 'bottom') {
			/* 轴线 */

			shapeArray.push(new Line({
				pointArray: [{ x: this.x, y: this.y }, { x: this.x + this.length, y: this.y }],
				style: lineStyle,
				zIndex: 1
			}));

			this.tickArray.forEach((tick) => {
				let x = this.x + tick.position;
				let y = this.y;
				/* 刻度线 */
				shapeArray.push(new Line({
					pointArray: [{ x: x, y: y }, { x: x, y: y + 8 }],
					style: lineStyle,
				}));

				/* label */
				shapeArray.push(new Text({
					x: this.x + tick.position,
					y: this.y + 12,
					value: tick.value,
					style: {
						textBaseline: 'top',
						textAlign: this.rotate === 0 ? 'center' : 'right'						
					},
					rotate: -1*this.rotate,
				}));
			}, this);

			/* 网格 */
			if(this.isGrid)
				this.tickArray.forEach((tick) => {
					let x = this.x + tick.position;
					let y = this.y;

					shapeArray.push(new Line({
						pointArray: [{ x: x, y: y }, { x: x, y: y - this.bodyHeight }],
						style: lineStyle,
						isDashed: true
					}));
				}, this);
		}
		/* 竖直坐标轴 */
		else if(this.position === 'left' || this.position === 'right') {
			shapeArray.push(new Line({
				pointArray: [{ x: this.x + this.width, y: this.y }, { x: this.x + this.width, y: this.y + this.length }],
				style: lineStyle,
				zIndex: 1
			}));

			this.tickArray.forEach((tick, index) => {
				let x = this.x + this.width;
				let y = this.y + this.length - tick.position;

				shapeArray.push(new Line({
					pointArray: [{ x: x, y: y }, { x: x - 8, y: y }],
					style: lineStyle
				}));

				shapeArray.push(new Text({
					x: this.x + this.width - 12,
					y: this.y + this.length - tick.position,
					value: tick.value,
					style: {
						textBaseline: 'middle',
						textAlign: 'right'
					},
					rotate: this.rotate					
				}));
			}, this);

			if(this.isGrid) {
				this.tickArray.forEach((tick) => {
					let x = this.x + this.width;
					let y = this.y + this.length - tick.position;

					shapeArray.push(new Line({
						pointArray: [{ x: x, y: y }, { x: x + this.bodyWidth, y: y }],
						style: lineStyle,
						isDashed: true
					}));
				}, this);				
			}
		}

		return shapeArray;
	}

	getWidth() {
		return this.width;
	}

	getShape() {
		this.update();
		return this.shapeArray;
	}
}

export { LinearAxis }