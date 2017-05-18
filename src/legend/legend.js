import { Circle } from '../shape/circle';
import { Text } from '../shape/text';
import { color } from '../theme/macaron';
import { max, sum } from '../util/util';

class Legend {
	constructor({ data, x, y, width, height, position = 'top', render }) {
		this.data = data;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.position = position;

		this.render = render;

		this.update();
	}

	color(color) {
		this.color = color;
	}

	update() {
		this.fit();
		this.shapeArray = this.computeShape();
	}

	fit() {
		let context = this.render.getContext();
		
		let r = 6;	
		let margin = 6;
		let fontSize = 12;
		let lengthArray = this.data.map((category, index, array) => 2*r + margin + context.measureText(category).width);

		if(this.postion === 'top' || this.position === 'bottom') {
			let lineIndex = 0;
			let x = 0;
			lengthArray.forEach((length) => {
				if((x + length) > this.width) {
					/* 放不下, 另起一行 */
					x = 0;
					lineIndex++;	
				}
			}, this);

			let totalHeight = lineIndex*(margin + fontSize) + fontSize;
			this.height = Math.max(this.height, totalHeight);
		}
		/* 左右方向排列的图例 */
		else if (this.position === 'left' || this.position === 'right') {
			let maxLegendWidth = max(lengthArray);
			this.width = Math.max(this.width, maxLegendWidth);
		}		
	}

	getWidth() {
		return this.width;
	}

	getHeight() {
		return this.height;
	}

	computeShape() {
		let context = this.render.getContext();

		let r = 6;	
		let margin = 6;
		let fontSize = 12;
		let lengthArray = this.data.map((item, index, array) => 2*r + margin + context.measureText(item).width);	

		let shapeArray = [];

		if(this.position === 'top' || this.position === 'bottom') {
			let lineIndex = 0;
			let x = 0;

			lengthArray.forEach(function (length, index) {
				if((x + length) > this.width) {
					/* 放不下, 另起一行 */
					x = 0;
					lineIndex++;	
				}

				let y = this.y + fontSize/2 + lineIndex*(fontSize + margin);

				shapeArray.push(new Circle({
					x: this.x + x + r,
					y: y,
					r: r,
					style: {
						fillStyle: this.color[index]
					},
					renderType: 'fill'
				}));

				shapeArray.push(new Text({
					x: this.x + x + 2*r + margin,
					y: y,
					value: this.data[index],
					style: {
						textBaseline: 'middle',
						textAlign: 'left'
					}	
				}));

				x += (length + margin);
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

	getShape() {
		this.update();
		return this.shapeArray;
	}
}

export { Legend };