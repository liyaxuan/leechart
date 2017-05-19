import { BarChart } from './geometry/bar';
import { LineChart } from './geometry/line';
import { PointChart } from './geometry/point';
import { PieChart } from './geometry/pie';
import { PolarAxis } from './axis/polar';
import { LinearAxis } from './axis/linear';
import { Legend } from './legend/legend';
import { ToolTip } from './tooltip/tooltip';
import { Rect } from './shape/rect';
import { LeeRender } from './leerender';
import STYLE from './theme/macaron';
import { sum, unique, getCol, group } from './util/util';

class LeeChart {
	constructor(container, { width = 600, height = 475, padding = { left: 50, right: 50, top: 50, bottom: 50 } } = {} ) {
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

		this.box = {
			left: [],
			right: [],
			top: [],
			bottom: []
		};
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

	x(col) {
		if(/line|point|bar/.test(this._type)) {
			this._xCol = col;
			this._xData = unique(getCol(this._data, col));
		}
			
		return this;
	}

	y(col) {
		if(/line|point|bar/.test(this._type)) {
			this._yCol = col;
			this._yData = group(this._data, col, this._xCol, this._colorCol);
		}
			
		return this;
	}

	theta(col) {
		if(/pie|doughnut|polar|radar/.test(this._type)) {
			this._thetaCol = col;
			this._thetaData = group(this._data, col, this._colorCol);
		}
			
		return this;			
	}

	r(col) {
		if(/pie|doughnut|polar|radar/.test(this._type)) {
			this._rCol = col;
			this._rData = group(this._data, col, this._thetaCol, this._colorCol);
		}
			
		return this;
	}

	color(col) {
		this._colorCol = col;
		this._colorData = unique(getCol(this._data, col));

		return this;
	}

	/* 构建坐标轴和图表 */
	build() {
		this._legend = new Legend({
			data: this._colorData || this._xData || this._thetaData,
			x: this.padding.left,
			y: this.height - this.padding.bottom,
			width: this.bodyWidth,
			height: this.padding.bottom,
			position: 'bottom',
			render: this.frontRender
		});

		this.box.bottom.push(this._legend);

		if(/line|point|bar/.test(this._type)) {
			let space = 24;

			this._xAxis = new LinearAxis({
				data: this._xData,
				type: 'category',
				chartType: this._type,
				width: this.bodyWidth,
				height: this.padding.bottom,
				bodyHeight: this.bodyHeight,
				position: 'bottom',
				space: space,
				render: this.backRender
			});	

			this.box.bottom.push(this._xAxis);

			this._yAxis = new LinearAxis({
				data: this._yData.reduce((pre, cur) => pre.concat(cur), []),
				type: 'linear',
				width: this.padding.left,
				height: this.bodyHeight,
				bodyWidth: this.bodyWidth,
				position: 'left',
				render: this.backRender
			});

			this.box.left.push(this._yAxis);

			let config = {
				data: this._data,
				dim: {
					x: this._xCol,
					y: this._yCol,
					color: this._colorCol
				},
				x: this.padding.left,
				y: this.padding.top,
				width: this.bodyWidth,
				height: this.bodyHeight,
				render: this.bodyRender,
				space: space
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
		else if(/pie|doughnut|polar/.test(this._type)) {
			let dim = {
				theta: this._thetaCol,
				color: this._colorCol
			};

			if(/polar/.test(this._type)) {
				dim.r = this._rCol;
				this._polarAxis = new PolarAxis({
					thetaData: unique(getCol(this._data, this._thetaCol)),
					rData: this._rData.reduce((pre, cur) => pre.concat(cur), []),
					x: this.padding.left,
					y: this.padding.top,
					width: this.bodyWidth,
					height: this.bodyHeight				
				});
			}

			this._chart = new PieChart({
				type: this._type,
				data: this._data,
				dim: dim,
				x: this.padding.left + 24,
				y: this.padding.top + 24,
				width: this.bodyWidth - 48,
				height: this.bodyHeight - 48,
				render: this.bodyRender
			})
		}

		let colorData = [];
		if(this._colorCol)
			colorData = this._colorData;
		else {
			if(this._xCol)
				colorData = this._xData
			else if(this._thetaCol)
				colorData = this._thetaData
		}

		let color = STYLE.color.slice(0, Math.max(colorData.length, 1))
		this._chart.color(color);
		this._legend.color(color);

		return this;
	}

	layout() {
		let lastWidth = this.bodyWidth;
		let lastHeight = this.bodyHeight;

		do {
			lastWidth = this.bodyWidth;
			lastHeight = this.bodyHeight;
			['left', 'right', 'top', 'bottom'].forEach((position, index) => {
				let offset = 0;

				this.box[position].forEach((box, index) => {
					if(/left|right/.test(position)) {
						box.bodyWidth = this.bodyWidth
						box.height = this.bodyHeight;
						let width = box.getWidth();

						if (position === 'left')
							box.x = offset;
						else
							box.x = this.width - offset - width;
						box.y = this.padding.top;

						offset += width;
					}
					else {
						box.bodyHeight = this.bodyHeight
						box.width = this.bodyWidth;
						let height = box.getHeight();

						box.x = this.padding.left;
						if (position === 'top')
							box.y = offset;
						else
							box.y = this.height - offset - height;

						offset += height;					
					}
				}, this);

				this.padding[position] = Math.max(this.padding[position], offset);

				this.bodyWidth = this.width - this.padding.left - this.padding.right;
				this.bodyHeight = this.height - this.padding.top - this.padding.bottom;
			}, this);

		} while(lastWidth != this.bodyWidth || lastHeight != this.bodyHeight)

		this._chart.x = this.padding.left;
		this._chart.y = this.padding.top;
		this._chart.width = this.bodyWidth;
		this._chart.height = this.bodyHeight;

		if(this._type === 'polar') {
			this._chart.x = this.padding.left + 24;
			this._chart.y = this.padding.top + 24;
			this._chart.width = this.bodyWidth - 48;
			this._chart.height = this.bodyHeight - 48;			
		}

		let chartBody = {
			x: this.padding.left,
			y: this.padding.top,
			width: this.bodyWidth,
			height: this.bodyHeight
		};

		this._toolTip = new ToolTip({
			data: this._data[0],
			x: chartBody.x,
			y: chartBody.y,
			chartBody: chartBody,
			render: this.frontRender
		});

		let self = this;

		this._chart.onmouseover = function (context, x, y, data) {
			self._toolTip.data = data;
			self._toolTip.x = x;
			self._toolTip.y = y;
			setTimeout(function () {
				self._toolTip.show();
			}, 0);
			
		};

		this._chart.onmousemove = function (context, x, y, data) {
			self._toolTip.x = x;
			self._toolTip.y = y;
			self._toolTip.move();
		};

		this._chart.onmouseout = function (context, x, y, data) {

			self._toolTip.hide();
			
		};
	}

	render() {
		this.build();
		this.layout();

		if(/line|point|bar/.test(this._type)) {
			this.backRender.addShape(this._xAxis.getShape());
			this.backRender.addShape(this._yAxis.getShape());
		}
		else if(/polar/.test(this._type))
			this.backRender.addShape(this._polarAxis.getShape());
		this.bodyRender.addShape(this._chart.getShape());
		this.frontRender.addShape(this._legend.getShape());

		this.backRender.requestRender();
		this.bodyRender.requestRender();
		this.frontRender.requestRender();
	}
}

export { LeeChart };