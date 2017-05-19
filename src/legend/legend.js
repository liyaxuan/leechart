import { Rect } from '../shape/rect';
import { Circle } from '../shape/circle';
import { Text } from '../shape/text';
import { color } from '../theme/macaron';
import { max, sum } from '../util/util';

let r = 6;	
let margin = 6;
let padding = 12;
let fontSize = 12;

class Legend {
	/* 水平方向 left center right */
	/* 竖直方向 top middle bottom */
	constructor({ data, x = 0, y = 0, width, height, position = 'top', align = 'center', render }) {
		this.data = data;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.position = position;

		this.render = render;
	}

	color(color) {
		this.color = color;
	}

	computeLength() {
		let context = this.render.getContext();
		return this.data.map((category, index, array) => 2*r + margin + context.measureText(category).width);
	}

	computeRow() {
		let lengthArray = this.computeLength();
		let rowIndex = 0;
		let xOffset = 0;

		let rowArray = []

		lengthArray.map((length) => {
			if((xOffset + length) > this.width) {
				/* 放不下, 另起一行 */
				xOffset = 0;
				rowIndex++;	
			}

			rowArray.push({
				rowIndex: rowIndex,
				xOffset: xOffset
			});

			xOffset += (length + margin);
		}, this);

		return rowArray;
	}

	fit() {
		if(this.position === 'top' || this.position === 'bottom') {
			let rowArray = this.computeRow();
			let rowCount = rowArray.slice(-1)[0].rowIndex + 1;
			let boundingHeight = (rowCount - 1)*(margin + fontSize) + fontSize;
			this.height = Math.max(this.height, boundingHeight + 2*padding);
		}
		/* 左右方向排列的图例 */
		else if (this.position === 'left' || this.position === 'right') {
			let lengthArray = this.computeLength();
			let maxLegendWidth = max(lengthArray);
			this.width = Math.max(this.width, maxLegendWidth + 2*padding);
		}
	}

	computeShape() {
		let lengthArray = this.computeLength();
		let shapeArray = [];

		if(this.position === 'top' || this.position === 'bottom') {
			let rowArray = this.computeRow();
			let rowCount = rowArray.slice(-1)[0].rowIndex + 1;

			let boundingWidth = rowArray.reduce((pre, cur, curIndex) => Math.max(cur.xOffset + lengthArray[curIndex], pre), 0);
			let boundingHeight = (rowCount - 1)*(fontSize + margin) + fontSize;

			rowArray.forEach(function (item, index) {
				let y = this.y + this.height/2 - boundingHeight/2 + fontSize/2 +  item.rowIndex*(fontSize + margin);
				
				shapeArray.push(new Circle({
					x: this.x + this.width/2 - boundingWidth/2 + item.xOffset + r,
					y: y,
					r: r,
					style: {
						fillStyle: this.color[index]
					},
					renderType: 'fill'
				}));

				shapeArray.push(new Text({
					x: this.x + this.width/2 - boundingWidth/2 + item.xOffset + 2*r + margin,
					y: y,
					value: this.data[index],
					style: {
						textBaseline: 'middle',
						textAlign: 'left'
					}	
				}));
			}, this);		
		}

		else if(this.position === 'left' || this.position === 'right') {
			lengthArray.forEach(function (length, index) {
				let y = this.y + fontSize/2 + index*(fontSize + margin);

				shapeArray.push(new Circle({
					x: this.x + r,
					y: y,
					r: r,
					style: {
						fillStyle: this.color[index]
					},
					renderType: 'fill'
				}));

				shapeArray.push(new Text({
					x: this.x + 2*r + margin,
					y: y,
					value: this.data[index],
					style: {
						textBaseline: 'middle',
						textAlign: 'left'
					}	
				}));
			}, this);
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
		this.shapeArray = this.computeShape();
		return this.shapeArray;
	}
}

export { Legend };