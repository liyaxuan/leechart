import { Text } from '../shape/text';
import { RoundRect } from '../shape/round-rect';
import { max, uuid } from '../util/util';

class ToolTip {
	constructor({ data, x, y, chartBody, render }) {
		this.data = data;
		this.x = x;
		this.y = y;
		this.chartBody = chartBody;	
		this.render = render;

		this.id = `tooltip-${uuid()}`;

		this.textArray = [];
		this.shapeArray = [];

		this.isDisplay = false;

		this.update();
	}

	color(color) {
		this.color = color;
	}

	show() {
		if(!this.isDisplay) {
			this.isDisplay = true;
			this.render.addShape(this.getShape());
			
			this.render.requestRender();
		}
	}

	hide() {
		if(this.isDisplay) {
			this.isDisplay = false;
			this.shapeArray.forEach(shape => this.render.removeShape(shape), this);
			
			this.render.requestRender();
		}
	}

	update() {
		this.textArray = this.computeText();
		this.shapeArray = this.computeShape();
	}

	computeText() {
		let textArray = [];
		for(let key in this.data) {
			textArray.push(`${key}: ${this.data[key]}`);
		}
		return textArray;	
	}

	computeShape() {

		let context = this.render.getContext();

		let maxTextWidth = max(this.textArray.map(text => context.measureText(text).width));
		let padding = 6;
		let r = 6;
		let margin = 6;
		let fontSize = 12;

		let width = maxTextWidth + padding*2;
		let height = (this.textArray.length - 1)*(fontSize + margin) + fontSize + 2*padding;

		let x = 0;
		let y = Math.max(this.y - height, this.chartBody.y);
		let xOffset = 6;
		/* 放左边放不下 */
		if(this.x - xOffset - width < this.chartBody.x)
			x = this.x + xOffset
		/* 左边放得下 */
		else
			x = this.x - xOffset - width;

		let roundRect = new RoundRect({
			x: x,
			y: y,
			width: width,
			height: height,
			r: r,
			style: {
				fillStyle: 'rgba(50,50,50,0.5)'
			},
			groupId: this.id,
			zIndex: 2
		});

		let textArray = this.textArray.map((text, index) => {
			return new Text({
				x: x + padding,
				y: y + padding + fontSize/2 + index*(fontSize + margin) ,
				value: text,
				style: {
					fillStyle: '#ffffff',
					textAlign: 'left',
					textBaseline: 'middle'
				},
				zIndex: 3,
				groupId: this.id
			})
		}, this);

		return [roundRect].concat(textArray);
	}

	getShape() {
		this.update();
		return this.shapeArray;
	}
}

export { ToolTip };