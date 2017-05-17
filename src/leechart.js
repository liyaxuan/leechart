import { BarChart } from './geometry/bar';
import { LineChart } from './geometry/line';
import { PointChart } from './geometry/point';
import { PieChart } from './geometry/pie';
import { LinearAxis } from './axis/linear';
import { Legend } from './legend/legend';
import { ToolTip } from './tooltip/tooltip';
import { Rect } from './shape/rect';
import { LeeRender } from './leerender';
import STYLE from './theme/macaron';

class LeeChart {
	constructor(container, { width = 480, height = 480, padding = { left: 50, right: 50, top: 50, bottom: 50 } } = {} ) {
		this.width = width;
		this.height = height;
		this.padding = padding;

		this.bodyWidth = this.width - this.padding.left - this.padding.right;
		this.bodyHeight = this.height - this.padding.top - this.padding.bottom;

		this.container = container;

		this.container.style = `width: ${this.width}px; height: ${this.height}px; position: relative`;

		this.container.onclick = (function (event) {
			this.backCanvas.onclick(event);
			this.bodyCanvas.onclick(event);
			this.frontCanvas.onclick(event);		
		}).bind(this);

		this.container.onmousemove = (function (event) {
			this.backCanvas.onmousemove(event);
			this.bodyCanvas.onmousemove(event);
			this.frontCanvas.onmousemove(event);	
		}).bind(this);

		['back', 'body', 'front'].forEach(function (prefix, index) {
			let canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;
			canvas.style = `position: absolute; z-index: ${index}`;
			this[`${prefix}Canvas`] = canvas;
			this[`${prefix}Render`] = new LeeRender(canvas);

			this.container.appendChild(canvas);
		}, this);		
	}

	type(_type) {
		if(/line|point|bar|pie|doughnut|polar|radar/.test(_type))
			this._type = _type;
		return this;
	}

	data(_data) {
		if(Array.isArray(_data))
			this._data = _data;
		return this;
	}

	x(colName) {
		if(/line|point|bar/.test(this._type)) {
			this._xData = this._data.map(item => item[colName]);

			this._xAxis = new LinearAxis({
				data: this._xData,
				x: this.padding.left,
				y: this.height - this.padding.bottom,
				width: this.padding.bottom,
				length: this.bodyWidth,
				bodyHeight: this.bodyHeight,
				position: 'bottom',
				isSpace: this._type === 'bar' ? true : false,
				context: this.backRender.getContext()
			});	
		}
			
		return this;
	}

	y(colName) {
		if(/line|point|bar/.test(this._type)) {
			this._yData = this._data.map(item => item[colName]);

			this._yAxis = new LinearAxis({
				data: this._yData,
				x: 0,
				y: this.padding.top,
				width: this.padding.left,
				length: this.bodyHeight,
				bodyWidth: this.bodyWidth,
				position: 'left',
				context: this.backRender.getContext()			
			});

			let config = {
				data: this._yData,
				x: this.padding.left,
				y: this.padding.top,
				width: this.bodyWidth,
				height: this.bodyHeight,
				render: this.bodyRender
			};

			if(this._type === 'bar') {
				this._chart = new BarChart(config);
			}
			else if(this._type === 'line') {
				this._chart = new LineChart(config);
			}
			else
				this._chart = new PointChart(config);		
		}
			
		return this;
	}

	theta(colName) {
		if(/pie|doughnut|polar|radar/.test(this._type)) {
			this._thetaData = this._data.map(item => item[colName]);

			this._chart = new PieChart({
				data: this._thetaData,
				x: this.padding.left,
				y: this.padding.top,
				width: this.bodyWidth,
				height: this.bodyHeight,
				render: this.bodyRender
			})
		}
			
		return this;			
	}

	r(colName) {
		if(/pie|doughnut|polar|radar/.test(this._type))
			this._rData = this._data.map(item => item[colName]);
		return this;
	}

	size(colName) {
		this._sizeData = this._data.map(item => item[colName]);
		return this;
	}

	color(colName) {
		if(this._chart) {
			this._chart.color(STYLE.color.slice(0, this._data.length));
		}
		return this;
	}

	fit() {
		let lastWidth = 0;
		let lastHeight = 0;

		do {
			lastWidth = this.bodyWidth;
			lastHeight = this.bodyHeight;

			/* 纵坐标轴 */
			let yAxisWidth = this._yAxis.getWidth();

			/* 更新图表 */
			this.padding[this._yAxis.position] = yAxisWidth;
			this.bodyWidth = this.width - this.padding.left - this.padding.right;

			/* 挤压 x 轴 */
			this._xAxis.x = this.padding.left;
			this._xAxis.length = this.bodyWidth;

			/* 挤压 geometry */
			this._chart.x = this.padding.left;
			this._chart.width = this.bodyWidth;

			/* 横坐标轴 */
			let xAxisHeight = this._xAxis.getWidth();

			this.padding[this._xAxis.position] = xAxisHeight;
			this.bodyHeight = this.height - this.padding.top - this.padding.bottom;

			/* 挤压 y 轴 */
			this._yAxis.y = this.padding.top;
			this._yAxis.length = this.bodyHeight;

			/* 挤压 geometry */
			this._chart.y = this.padding.top;
			this._chart.height = this.bodyHeight;

		} while(lastWidth != this.bodyWidth || lastHeight != this.bodyHeight)
	}

	layout() {
		if(/line|point|bar/.test(this._type)) {
			let backContext = this.backRender.getContext();

			this.fit();

			// let obj = this._xAxis.getBoundingRect(backContext);

			// obj.style = { fillStyle : 'rgba(0, 255, 0, 0.50)' };

			// this.backRender.addShape(new Rect(obj));
			// this.backRender.addShape(new Rect({
			// 	x: this.padding.left,
			// 	y: this.padding.top,
			// 	width: this.bodyWidth,
			// 	height: this.bodyHeight,
			// 	style: {
			// 		fillStyle: 'rgba(255, 0, 0, 0.50)'
			// 	}
			// }));



			this.backRender.addShape(this._xAxis.getShape(backContext));
			this.backRender.addShape(this._yAxis.getShape(backContext));
		}
		else if(/pie|doughnut|polar|radar/.test(this._type)) {
			
		}

		let chartBody = {
			x: this.padding.left,
			y: this.padding.top,
			width: this.bodyWidth,
			height: this.bodyHeight
		};

		this._toolTip = new ToolTip({
			data: { name: '李亚轩', age: 22, weight: 67, height: 183 },
			x: chartBody.x,
			y: chartBody.y,
			chartBody: chartBody,
			render: this.frontRender
		});

		this._chart.onmouseover = (function (context, x, y, index) {
			this._toolTip.data = this._data[index];
			this._toolTip.x = x;
			this._toolTip.y = y;
			this._toolTip.show();
		}).bind(this);

		this._chart.onmousemove = (function (context, x, y, index) {
			this._toolTip.x = x;
			this._toolTip.y = y;
			this._toolTip.update();
		}).bind(this);

		this._chart.onmouseout = (function (context, x, y, index) {
			this._toolTip.hide();	
		}).bind(this);

		this.bodyRender.addShape(this._chart.getShape());

		return this;
	}

	render() {
		this.backRender.requestRender();
		this.bodyRender.requestRender();
		this.frontRender.requestRender();
	}
}

export { LeeChart };