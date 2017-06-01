import { max, min, linearTick, getTextBoundingRect } from '../util/util';
import { Line } from '../shape/line';
import { Text } from '../shape/text';

class LinearAxis {
	constructor({ data, type = 'linear', chartType, x = 0, y = 0, width, height, bodyHeight, bodyWidth, position = 'left', space = 0, isBeginAtZero = false, isGrid = true, render }) {
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

			return {
				value: tick,
				position: position
			};
		}, this);
	}

	/* 计算 label 的旋转 */
	fit() {
		this.tickArray = this.computeTick();
		let context = this.render.getContext();

		let limitedLabelWidth = 0;
		let maxLabelWidth = max(this.tickArray.map(tick => context.measureText(tick.value).width ));
		
		/* 水平坐标轴的限制在于宽度 */
		if(/top|bottom/.test(this.position)) {
			let rotate = 0;
			
			let textAlign = 'center';
			let textBaseline = 'top';

			/* 先处理宽度, 计算 rotate */
			let leftWidth = this.width;
			if(this.isSpace) {
				/* 剔除了两端的距离, 将剩下的部分平分 */
				leftWidth = this.width - this.width/(this.tickArray.length + 1)
			}
			/* 设刻度之间的最小距离为4 */
			limitedLabelWidth = (leftWidth - 4*(this.tickArray.length - 1))/this.tickArray.length;

			if(maxLabelWidth > limitedLabelWidth) {
				rotate = Math.acos(limitedLabelWidth/maxLabelWidth);
				textAlign = 'right';
			}
			this.rotate = rotate;

			/* 接下来处理高度, 根据需要进行拓高 */
			let height = this.tickArray.reduce(function (pre, cur) {
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
		let lineStyle = {
			strokeStyle: '#d9d9d9',
			lineWidth: 1
		};

		let shapeArray = [];
		/* 水平坐标轴 */
		if(/top|bottom/.test(this.position)) {
			/* 轴线 */

			shapeArray.push(new Line({
				pointArray: [{ x: this.x, y: this.y }, { x: this.x + this.width, y: this.y }],
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
			if(this.isGrid) {
				let gridArray = this.tickArray;
				if(this.space !== 0)
					gridArray = gridArray.concat({
						value: '',
						position: this.width
					});

				gridArray .forEach((tick) => {
					let x = this.x + tick.position;
					let y = this.y;

					shapeArray.push(new Line({
						pointArray: [{ x: x, y: y }, { x: x, y: y - this.bodyHeight }],
						style: lineStyle,
						isDashed: true
					}));
				}, this);				
			}
		}
		/* 竖直坐标轴 */
		else if(/left|right/.test(this.position)) {
			shapeArray.push(new Line({
				pointArray: [{ x: this.x + this.width, y: this.y }, { x: this.x + this.width, y: this.y + this.height }],
				style: lineStyle,
				zIndex: 1
			}));

			this.tickArray.forEach((tick, index) => {
				let x = this.x + this.width;
				let y = this.y + this.height - tick.position;

				shapeArray.push(new Line({
					pointArray: [{ x: x, y: y }, { x: x - 8, y: y }],
					style: lineStyle
				}));

				shapeArray.push(new Text({
					x: this.x + this.width - 12,
					y: this.y + this.height - tick.position,
					value: tick.value,
					style: {
						textBaseline: 'middle',
						textAlign: 'right'
					},
					rotate: this.rotate					
				}));
			}, this);

			if(this.isGrid) {
				let gridArray = this.tickArray;
				if(this.space !== 0)
					gridArray = gridArray.concat({
						value: '',
						position: this.height
					});

				gridArray.forEach((tick) => {
					let x = this.x + this.width;
					let y = this.y + this.height - tick.position;

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
		this.fit();
		return this.width;
	}

	getHeight() {
		this.fit();
		return this.height;
	}

	getShape() {
		this.tickArray = this.computeTick();
		this.fit();
		this.shapeArray = this.computeShape();		
		return this.shapeArray;
	}
}

export { LinearAxis }