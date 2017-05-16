import { Text } from '../shape/text';
import { RoundRect } from '../shape/round-rect';
import { max, uuid } from '../util/util';

class Tooltip {
	constructor({ data, x, y, chartBody, context }) {
		this.data = data;
		this.x = x;
		this.y = y;
		this.chartBody = chartBody;	
		this.context = context;

		this.id = `tooltip-${uuid()}`;

		this.textArray = [];
		this.shapeArray = [];

		this.update();
	}

	color(color) {
		this.color = color;
	}

	update() {
		this.textArray = this.computeText();
		this.shapeArray = this.computeShape();
	}

	computeText() {
		let textArray = [];
		for(let key in this.data) {
			textArray.push(Math.max(`${key}: ${this.data[key]}`));
		}
		return textArray;	
	}

	computeShape() {
		let context = this.context;

		let maxTextWidth = max(this.textArray.map(text => context.measureText(text)));
		let padding = 6;
		let r = 6;
		let margin = 6;
		let fontSize = 12;

		let width = maxTextWidth + padding*2;
		let height = (this.textArray.length - 1)*(fontSize + margin) + fontSize + 2*padding;

		let x = 0;
		let y = Math.min(this.y - height, this.chartBody.y);
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
			groupId: this.id
		});

		let textArray = this.textArray.map((text, index) => {
			return new Text({
				x: x + padding,
				y: y + padding + index*(fontSize + margin) ,
				value: text,
				style: {
					fillStyle: '#ffffff',
					textAlign: 'left',
					textBaseline: 'top'
				},
				zIndex: 1,
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