import { BarChart } from './geometry/bar';
import { LineChart } from './geometry/line';
import { PointChart } from './geometry/point';
import { PieChart } from './geometry/pie';
import { RadarChart } from './geometry/radar';
import { ThetaAxis } from './axis/theta';
import { LinearAxis } from './axis/linear';
import { Legend } from './legend/legend';
import { ToolTip } from './tooltip/tooltip';
import { Rect } from './shape/rect';
import { LeeRender } from './leerender';
import STYLE from './theme/macaron';
import { sum, unique, getCol, group } from './util/util';

class LeeChart {
	constructor(container, { width = 400, height = 400, padding = { left: 50, right: 50, top: 50, bottom: 50 } } = {} ) {
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

		this.resetData();
		this.resetLayout();
		this.resetConfig();
	}

	resetData() {
		this._type = 'bar';
		this._data = [];
		this._color = [];
		this.colorData = [];
		this.dim = [];		
	}

	resetLayout() {
		this.box = {
			left: [],
			right: [],
			top: [],
			bottom: []
		};
	}

	resetConfig() {
		this.config = {
			axis: {
				x: {
					position: 'bottom',
					isGrid: true,
					isDisplay: true,
					space: 0, // 'auto'
					formatter: function (value) { return value; }
				},
				y: {
					postion: 'left',
					isGrid: true,
					isDisplay: true,
					space: 0,
					formatter: function (value) { return value; }
				},
				theta: {
					isGrid: true,
					isDisplay: true,
					formatter: function (value) { return value; }
				},
				r: {
					isGrid: true,
					isDisplay: true,
					formatter: function (value) { return value; }
				}
			},
			chart: {
				isStacked: false,
				isArea: false
			},
			legend: {
				title: null,
				position: 'top',
				align: 'left',
				isDisplay: true
			},
			tooltip: {
				isDisplay: true,
				formatter: function (key, value) {
					return `${key}: ${value}`;
				}				
			}
		};		
	}

	clearRender() {
		this.backRender.clear();
		this.bodyRender.clear();
		this.frontRender.clear();
	}

	type(type) {
		if(/point|line|bar|pie|doughnut|polar|radar/.test(type))
			this._type = type;
		return this;
	}

	stack(isStacked = true) {
		if(/line|bar/.test(this._type))
			this.config.chart.isStacked = isStacked;
		return;
	}

	area(isArea = true) {
		if(this._type === 'line');
			this.config.chart.isArea = isArea;
		return this;
	}

	axis(dim, config) {
		let axis = this.config.axis[dim];
		if(typeof config === 'boolean')
			axis.isDisplay = config;
		else if(typeof config === 'object') {
			if(dim === 'x' || dim === 'y') {
				axis.position = config.position || axis.position;
				axis.space = config.space || axis.space;
			}
				
			axis.isGrid = config.isGrid || axis.isGrid;
			axis.formatter = config.formatter || axis.formatter;			
		}

		return this;
	}

	legend(config) {
		let legend = this.config.legend;
		if(typeof config === 'boolean')
			tooltip.isDisplay = config;
		else if(typeof config === 'object') {
			legend.title = config.title || legend.title;
			legend.position = config.position || legend.position;
			legend.align = config.align || legend.align;			
		}

		return this;
	}

	tooltip(formatter) {
		let tooltip = this.config.tooltip
		if(typeof formatter === 'boolean')
			tooltip.isDisplay = formatter;
		else if(typeof formatter === 'function')
			tooltip.formatter = formatter;
		return this;
	}

	data(data) {
		if(Array.isArray(data))
			this._data = data;
		return this;
	}

	color(name, color) {
		let data = unique(getCol(this._data, name));
		this.colorData = data;
		this._color = [].concat(color || STYLE.color.slice(0, data.length));

		if(/pie|doughnut/.test(this._type)) {
			this.dim[1] = {
				name: name,
				data: data,
				type: 'category'
			};
		}
		else if(/line|point|bar|polar|radar/.test(this._type)) {
			this.dim[2] = {
				name: name,
				data: data,
				type: 'category'
			};
		}

		return this;
	}	

	x(name) {
		if(/line|point|bar/.test(this._type)) {
			let data = getCol(this._data, name);
			let type = 'category';

			if(typeof data[0] === 'string') {
				data = unique(data);
			}
			else if(typeof data[0] === 'number') {
				type = 'linear';
			}

			this.dim[1] = {
				name: name,
				data: data,
				type: type,
			};
		}
		
		return this;
	}

	y(name) {
		if(/line|point|bar/.test(this._type)) {
			this.dim[0] = {
				name: name,
				data: null,
				type: 'linear'
			};
		}
			
		return this;
	}

	theta(name) {
		if(/pie|doughnut/.test(this._type)) {
			this.dim[0] = {
				name: name,
				data: null,
				type: 'linear'
			};
		}
		else if(/polar|radar/.test(this._type)) {
			this.dim[1] = {
				name: name,
				data: unique(getCol(this._data, name)),
				type: 'category'
			};
		}
			
		return this;			
	}

	r(name) {
		if(/polar|radar/.test(this._type)) {
			this.dim[0] = {
				name: name,
				data: null,
				type: 'linear'
			}
		}
			
		return this;
	}

	computeMapping() {
		let data = [];

		if(this.dim[1] && this.dim[2] && this.dim[1].name !== this.dim[2].name) {
			data = group(this._data, this.dim[0].name, this.dim[1].name, this.dim[2].name);	
		}
		else if((this.dim[1] && this.dim[2] && this.dim[1].name === this.dim[2].name) || (this.dim[1] && !this.dim[2])) {

			data = group(this._data, this.dim[0].name, this.dim[1].name).map(group => group.slice(0, 1));

			this.colorData = this.dim[1].data.slice(0);
			this._color = STYLE.color.slice(0, this.colorData.length);
		}

		this.dim[0].data = data;

	}

	/* 构建坐标轴和图表 */
	buildLegend() {
		let position = this.config.legend.position;

		/* 需要修改 */
		this.legend = new Legend({
			data: this.colorData,
			color: this._color,
			/* layout 阶段修改决定的 */
			x: this.padding.left,
			y: this.height - this.padding.bottom,
			width: this.bodyWidth,
			height: this.padding.bottom,

			position: position,
			render: this.frontRender
		});

		this.box[position].push(this.legend);		
	}

	buildRectChart() {
		let space = 24;

		this.xAxis = new LinearAxis({
			data: this.dim[1].data,
			type: this.dim[1].type,
			chartType: this._type,
			width: this.bodyWidth,
			height: this.padding.bottom,
			bodyHeight: this.bodyHeight,
			position: 'bottom',
			space: space,
			render: this.backRender
		});	

		this.box.bottom.push(this.xAxis);

		this.yAxis = new LinearAxis({
			data: this.dim[0].data.reduce((pre, cur) => pre.concat(cur), []),
			type: this.dim[0].type,
			width: this.padding.left,
			height: this.bodyHeight,
			bodyWidth: this.bodyWidth,
			position: 'left',
			render: this.backRender
		});

		this.box.left.push(this.yAxis);

		let config = {
			data: this.dim[0].data,
			color: this._color,

			render: this.bodyRender,
			space: space
		};

		if(this._type === 'bar') {
			this.geometry = new BarChart(config);
		}
		else if(this._type === 'line') {
			this.geometry = new LineChart(config);
		}
		else
			this.geometry = new PointChart(config);	
	}

	buildThetaChart() {	
		let dim = this.dim;

		if(/polar|radar/.test(this._type)) {

			this.thetaAxis = new ThetaAxis({
				type: this._type,
				thetaData: dim[1].data,
				rData: dim[0].data.reduce((pre, cur) => pre.concat(cur), []),
				// x: this.padding.left,
				// y: this.padding.top,
				// width: this.bodyWidth,
				// height: this.bodyHeight				
			});
		}

		let T = this._type === 'radar' ? RadarChart : PieChart;

		this.geometry = new T({
			type: this._type,
			data: dim[0].data,
			color: this._color,
			// x: this.padding.left + 24,
			// y: this.padding.top + 24,
			// width: this.bodyWidth - 48,
			// height: this.bodyHeight - 48,
			render: this.bodyRender
		})
	}

	build() {
		this.computeMapping();
		this.buildLegend();

		if(/line|point|bar/.test(this._type)) {
			this.buildRectChart();
		}
		else if(/pie|doughnut|polar|radar/.test(this._type)) {
			this.buildThetaChart();
		}

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

		this.geometry.x = this.padding.left;
		this.geometry.y = this.padding.top;
		this.geometry.width = this.bodyWidth;
		this.geometry.height = this.bodyHeight;

		if(this._type === 'polar' || this._type === 'radar') {
			this.thetaAxis.x = this.padding.left;
			this.thetaAxis.y = this.padding.top;
			this.thetaAxis.width = this.bodyWidth;
			this.thetaAxis.height = this.bodyHeight;

			this.geometry.x = this.padding.left + 24;
			this.geometry.y = this.padding.top + 24;
			this.geometry.width = this.bodyWidth - 48;
			this.geometry.height = this.bodyHeight - 48;			
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

		this.geometry.onmouseover = function (context, x, y, groupIndex, index) {
			self.toolTip.data = data;
			self.toolTip.x = x;
			self.toolTip.y = y;
			setTimeout(function () {
				self.toolTip.show();
			}, 0);
		};

		this.geometry.onmousemove = function (context, x, y, groupIndex, index) {
			self.toolTip.x = x;
			self.toolTip.y = y;
			self.toolTip.move();
		};

		this.geometry.onmouseout = function (context, x, y, groupIndex, index) {

			self.toolTip.hide();
			
		};
	}

	render() {
		this.build();
		this.layout();

		if(/line|point|bar/.test(this._type)) {
			this.backRender.addShape(this.xAxis.getShape());
			this.backRender.addShape(this.yAxis.getShape());
		}
		else if(/polar|radar/.test(this._type))
			this.backRender.addShape(this.thetaAxis.getShape());
		this.bodyRender.addShape(this.geometry.getShape());
		this.frontRender.addShape(this.legend.getShape());

		this.backRender.requestRender();
		this.bodyRender.requestRender();
		this.frontRender.requestRender();
	}
}

window.LeeChart = LeeChart;

export { LeeChart };