/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Shape; });


class Shape {
	constructor({ type, style, renderType = 'fill', groupId, zIndex = 0, isAnimation = false, isDisplay = true }) {
		this.type = type;

		this.style = style;
		this.renderType = renderType;
		this.groupId = groupId;
		this.zIndex = zIndex;

		this.eventTypes = ['click', 'mousemove', 'mouseover', 'mouseout'];
		this.onclick = [];
		this.onmousemove = [];
		this.onmouseover = [];
		this.onmouseout = [];
		
		this.isDisplay = true;

		this.isAnimation = isAnimation;
		this.animationArray = [];

		this._render = null;
	}

	setRender(render) {
		this._render = render;
	}

	show() {
		if(!this.isDisplay) {
			this.isDisplay = true;
			this._render.requestRender();
		}
	}

	hide() {
		if(this.isDisplay) {
			this.isDisplay = false;
			this._render.requestRender();
		}
	}

	init(config) {
		for(let attr in config) {
			this[attr] = config[attr];
		}
		return this;	
	}

	when(duration, config, callback = function () {}) {
		this.animationArray.push({ duration, config, callback });
		return this;
	}

	run(index) {
		function toEnd(current, begin, end) {
			return end > begin ? Math.min(current, end) : Math.max(current, end);	
		}

		/* 队列为空 */
		let length = this.animationArray.length;
		if(length === 0)
			return;
		/* i 是动画队列的索引 */
		let i = index;
		/* 如果已经遍历过一遍队列了, 但是是循环的 */
		if(index > length - 1 && this.isCycle)
			i = i%length;
		/* 如果已经遍历过一遍队列了, 但不是循环的 */
		else if(index > length - 1 && !this.isCycle) {

			return;
		}
			
		/* 取出任务执行 */
		let { duration, config } = this.animationArray[i];
		
		let attrArray = [];
		for(let attr in config) {
			let begin = this[attr];
			let end = config[attr];
			attrArray.push({ attr, begin, end });
		}

		let currentTime = 0;
		let func = __WEBPACK_IMPORTED_MODULE_0__util_easing__["a" /* default */].easeInOutQuad;
		let timer = setInterval((function () {
			if(currentTime > duration) {
				clearInterval(timer);		
				attrArray.forEach(({ attr, begin, end }) => {
					if(Array.isArray(begin) && Array.isArray(end)) {
						this[attr] = end.map(({ x, y }) => {
							return { x, y }
						});
					}
					else
						this[attr] = end;
				});

				this.run(index + 1);
				return;
			}
				
			attrArray.forEach(({ attr, begin, end }) => {
				if(Array.isArray(begin) && Array.isArray(end)) {
					let current = begin.map((item, index) => {

						let x = func(null, currentTime, item.x, end[index].x - item.x, duration);
						let y = func(null, currentTime, item.y, end[index].y - item.y, duration);

						x = toEnd(x, item.x, end[index].x);
						y = toEnd(y, item.y, end[index].y);

						return { x, y };
					});

					this[attr] = current;
				}
				/* 单值 x y width height r */
				else {
					let current = func(null, currentTime, begin, end - begin, duration);
					this[attr] = toEnd(current, begin, end);					
				}	
			}, this);

			this._render.requestRender();
			currentTime += 1000/60;
		}).bind(this), 1000/60);		
	}

	start(isCycle = false) {
		this.isCycle = isCycle;
		this.run(0);

		return this;
	}

	stop() {
		this.isCycle = false;
		return this;
	}

	addEventListener(eventType, callback) {
		if(this.eventTypes.join(', ').indexOf(eventType) === -1)
			return;
		else
			this['on' + eventType].push(callback.bind(this));
	}

	removeEventListener(eventType, callback) {
		if(this.eventTypes.join(', ').indexOf(eventType) === -1)
			return;
		else {
			let eventQueue = this['on' + eventType];
			let isFound = false;
			for(let i = 0; i < eventQueue.length; i++) {
				if(eventQueue[i] === callback || isFound) {
					eventQueue[i] = eventQueue[i + 1];
					isFound = true;
				}
			}
			if(isFound)
				eventQueue.pop();
		}
	}

	isPointIn(context, x, y) {
		context.beginPath();
		this.buildPath(context);
		return context.isPointInPath(x, y);
	}

	render(context) {
		if(!this.isDisplay)
			return;

		context.save();
		context.beginPath();
		for(let attr in this.style)
			context[attr] = this.style[attr];
		this.buildPath && this.buildPath(context);
		
		if(this.renderType === 'fillstroke') {
			context.fill();
			context.stroke();
		}
		else
			context[this.renderType]();
		context.restore();
	}
}



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return max; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return min; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return sum; });
/* unused harmony export range */
/* unused harmony export nice */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return linearTick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return getTextBoundingRect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return unique; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return uuid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getCol; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return group; });
function max(array) {
	return Math.max.apply({}, array);
}

function min(array) {
	return Math.min.apply({}, array);
}

function sum(array) {
	return array.reduce((pre, cur) => pre + cur, 0);
}

function range(array) {
	return max(array) - min(array);
}

function almostEquals(x, y, epsilon) {
	return Math.abs(x - y) < epsilon;
}

function nice(range, round) {
	var exponent = Math.floor(Math.log10(range));
	var fraction = range / Math.pow(10, exponent);
	var niceFraction;

	if (round) {
		if (fraction < 1.5) {
			niceFraction = 1;
		} else if (fraction < 3) {
			niceFraction = 2;
		} else if (fraction < 7) {
			niceFraction = 5;
		} else {
			niceFraction = 10;
		}
	} else if (fraction <= 1.0) {
		niceFraction = 1;
	} else if (fraction <= 2) {
		niceFraction = 2;
	} else if (fraction <= 5) {
		niceFraction = 5;
	} else {
		niceFraction = 10;
	}

	return niceFraction * Math.pow(10, exponent);
}

function linearTick(min, max, count = 11) {
	var ticks = [];
	// To get a "nice" value for the tick spacing, we will use the appropriately named
	// "nice number" algorithm. See http://stackoverflow.com/questions/8506881/nice-label-algorithm-for-charts-with-minimum-ticks
	// for details.
	var niceRange = nice(max - min, false);
	var spacing = nice(niceRange / (count - 1), true);

	var niceMin = Math.floor(min / spacing) * spacing;
	var niceMax = Math.ceil(max / spacing) * spacing;

	var numSpaces = (niceMax - niceMin) / spacing;
	if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
		numSpaces = Math.round(numSpaces);
	} else {
		numSpaces = Math.ceil(numSpaces);
	}
	// Put the values into the ticks array

	ticks.push(niceMin);
	for (var j = 1; j < numSpaces; ++j) {
		ticks.push(niceMin + (j * spacing));
	}
	ticks.push(niceMax);

	return ticks;
}

function getTextBoundingRect({ context, x = 0, y = 0, text, rotate, fontSize, textAlign, textBaseline }) {
		let rectX = 0;
		let rectY = 0;
		let rectWidth = context.measureText(text).width;
		let rectHeight = fontSize;

		switch (textAlign) {
			case 'left':
				rectX = x;
				break;
			case 'center':
				rectX = x - rectWidth/2;
				break;
			case 'right':
				rectX = x - rectWidth;
				break;
		}
		switch (textBaseline) {
			case 'top':
				rectY = y;
				break;
			case 'middle':
				rectY = y - rectHeight/2;
				break;
			case 'bottom':
				rectY = y - rectHeight;
				break;
		}

		let pointArray = [{ x: rectX, y: rectY },
		{ x: rectX + rectWidth, y: rectY },
		{ x: rectX, y: rectY + rectHeight },
		{ x: rectX + rectWidth, y: rectY + rectHeight }];

		let rotatedPointArray = pointArray.map(function (point) {

			let _x = x + Math.cos(rotate)*(point.x - x) - Math.sin(rotate)*(point.y - y);
			let _y = x + Math.sin(rotate)*(point.x - x) + Math.cos(rotate)*(point.y - y);

			return {
				x: _x,
				y: _y
			};
		}, this);

		let xArray = rotatedPointArray.map((point) => point.x);
		let yArray = rotatedPointArray.map((point) => point.y);

		rectX = min(xArray);
		rectY = min(yArray);
		rectWidth = max(xArray) - rectX;
		rectHeight = max(yArray) - rectY;

		return {
			x: rectX,
			y: rectY,
			width: rectWidth,
			height: rectHeight
		}
}

let uid = 0;
function uuid() {
	return uid++;
}

function unique(array) {
	let result = [];
	let set = new Set(array);
	for(let item of set.keys())
		result.push(item);
	return result;
}

function getCol(data, col) {
	if(data[0] && data[0][col])
		return data.map(item => item[col]);
	else
		return [];
}

function group(data, resultDim, dim1, dim2) {
	let dim1Array = unique(getCol(data, dim1));
	let dim2Array = dim2 ? unique(getCol(data, dim2)) : [];

	let result = [];

	data.forEach((item) => {
		let i = dim1Array.findIndex(dim1Item => dim1Item === item[dim1]);		
		result[i] = result[i] || [];
		if(dim2) {
			let j = dim2Array.findIndex(dim2Item => dim2Item === item[dim2]);
			result[i][j] = item[resultDim];
		}
		else
			result[i].push(item[resultDim]);
	});

	return result;	
}



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
	// t: current time, b: begInnIng value, c: change In value, d: duration
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Text; });



class Text extends __WEBPACK_IMPORTED_MODULE_1__shape__["a" /* Shape */] {
	constructor({ x, y, value, rotate = 0, style, renderType = 'fill', groupId, zIndex }) {
		super({
			type: 'text',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		this.x = x;
		this.y = y;
		this.value = value.toString();

		this.rotate = rotate;
	}

	isPointIn(context, x, y) {
		let { x: _x, y: _y, width: _w, height: _h } = this.getBoundingRect(context);

		return (x > _x) && (x < _x + _w) && (y > _y) && (y < _y + _h);
	}

	getBoundingRect(context) {
		let rectX = 0;
		let rectY = 0;
		let rectWidth = context.measureText(this.value).width;
		let rectHeight = parseInt(/\d+/.exec(context.font)[0]);

		switch (context.textAlign) {
			case 'left':
				rectX = this.x;
				break;
			case 'center':
				rectX = this.x - rectWidth/2;
				break;
			case 'right':
				rectX = this.x - rectWidth;
				break;
		}
		switch (context.textBaseline) {
			case 'top':
				rectY = this.y;
				break;
			case 'middle':
				rectY = this.y - rectHeight/2;
				break;
			case 'bottom':
				rectY = this.y - rectHeight;
				break;
		}

		let pointArray = [{ x: rectX, y: rectY },
		{ x: rectX + rectWidth, y: rectY },
		{ x: rectX, y: rectY + rectHeight },
		{ x: rectX + rectWidth, y: rectY + rectHeight }];

		let rotatedPointArray = pointArray.map(function (point) {
			let x = point.x;
			let y = point.y;

			let m = this.x;
			let n = this.y;

			let a = this.rotate;

			let _x = m + Math.cos(a)*(x - m) - Math.sin(a)*(y - n);
			let _y = n + Math.sin(a)*(x - m) + Math.cos(a)*(y - n);

			return {
				x: _x,
				y: _y
			};
		}, this);

		let xArray = rotatedPointArray.map((point) => point.x);
		let yArray = rotatedPointArray.map((point) => point.y);

		rectX = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* min */])(xArray);
		rectY = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* min */])(yArray);
		rectWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(xArray) - rectX;
		rectHeight = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(yArray) - rectY;

		return {
			x: rectX,
			y: rectY,
			width: rectWidth,
			height: rectHeight
		}
	}

	render(context) {
		context.save();
		for(let attr in this.style)
			context[attr] = this.style[attr];

		if(this.rotate !== 0) {
			context.translate(this.x, this.y);
			context.rotate(this.rotate);
			context.fillText(this.value, 0, 0);		
		}
		else {

			context.fillText(this.value, this.x, this.y);
		}
		context.restore();	
	}
}



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Rect; });



class Rect extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ x, y, width, height, style, renderType, groupId, zIndex, isAnimation }) {
		super({
			type: 'rect',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.x = x;
		this.originalY = y;
		this.y = y;
		this.width = width;
		this.originalHeight = height;
		this.height = height;
	}

	buildPath(context) {
		context.rect(this.x, this.y, this.width, this.height);		
	}
}



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Circle; });



class Circle extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ x, y, r, style, renderType, groupId, zIndex, isAnimation }) {
		super({
			type: 'circle',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.x = x;
		this.y = y;
		this.originalR = r;
		this.r = r;
	}

	buildPath(context) {
		context.arc(this.x, this.y, this.r, 0, 2*Math.PI);
	}
}



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape_shape__ = __webpack_require__(0);


class LeeRender {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.shapeLayer = [];
		this.shapeGroup = {};

		let self = this;

		this.canvas.onclick = function (event) {
			let rect = self.canvas.getBoundingClientRect();
			let x = event.clientX - rect.left;
			let y = event.clientY - rect.top;

			self.shapeLayer.reverse().forEach(function (layer) {
				layer.forEach(function (shape) {
					if(shape.isPointIn(self.context, x, y))
						shape.onclick.forEach((callback) => callback(self.context, x, y));					
				});
			});
		};

		let preMouseOverX = 0;
		let preMouseOverY = 0;

		this.canvas.onmousemove = function (event) {
			let rect = self.canvas.getBoundingClientRect();
			let x = event.clientX - rect.left;
			let y = event.clientY - rect.top;

			self.shapeLayer.forEach(function (layer) {
				layer.forEach(function (shape) {
					let isPreIn = shape.isPointIn(self.context, preMouseOverX, preMouseOverY);
					let isCurIn = shape.isPointIn(self.context, x, y);

					if(isPreIn && isCurIn)
						shape.onmousemove.forEach((callback) => callback(self.context, x, y));
					if(isCurIn && !isPreIn)
						shape.onmouseover.forEach((callback) => callback(self.context, x, y));
					if(!isCurIn && isPreIn)
						shape.onmouseout.forEach((callback) => callback(self.context, x, y));
				});
			});

			preMouseOverX = x;
			preMouseOverY = y;
		};

		this.isDirty = false;

		setInterval((function () {
			if(this.isDirty) {
				this.render();
				this.isDirty = false;
			}		
		}).bind(this), 1000/60);
	}

	_addShape(shape) {
		shape.setRender(this);

		this.shapeLayer[shape.zIndex] = this.shapeLayer[shape.zIndex] || [];
		this.shapeLayer[shape.zIndex].push(shape);
		if(shape.groupId) {
			this.shapeGroup[shape.groupId] = this.shapeGroup[shape.groupId] || [];
			this.shapeGroup[shape.groupId].push(shape);
		}
	}

	addShape(shape) {

		if(shape instanceof __WEBPACK_IMPORTED_MODULE_0__shape_shape__["a" /* Shape */]) {
			this._addShape(shape);
		}
		else if(Array.isArray(shape)) {
			shape.forEach((shape) => {
				if(shape instanceof __WEBPACK_IMPORTED_MODULE_0__shape_shape__["a" /* Shape */])
					this._addShape(shape);
			}, this);
		}
	}

	_removeItem(array, item) {
		let isFound = false;
		for(let i = 0; i < array.length; i++) {
			if(array[i] === item || isFound) {
				array[i] = array[i + 1];
				isFound = true;
			}
		}
		if(isFound)
			array.pop();		
	}

	removeShape(shape) {
		this._removeItem(this.shapeLayer[shape.zIndex], shape);
		if(shape.groupId && this.shapeGroup[shape.groupId]) {
			this._removeItem(this.shapeGroup[shape.groupId], shape);
		}
	}

	getContext() {
		return this.context;
	}

	requestRender() {
		this.isDirty = true;
	}

	render() {
		let context = this.context;

		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.shapeLayer.forEach(function (layer) {
			layer.forEach(function (shape) {
				shape.render(context);
			})	
		});	
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LeeRender;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Line; });




class Line extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ pointArray, isDashed = false, style, groupId, zIndex, isAnimation }) {
		super({
			type: 'line',
			style: style,
			renderType: 'stroke',
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.originalPointArray = pointArray;
		this.pointArray = pointArray.map(({ x, y }) => {
			return { x: x, y: y }
		});

		this.isDashed = isDashed;
	}

	buildPath(context) {
		// if(context.lineWidth === 1) {
		// 	for(let i = 0, p = this.pointArray[i], np = this.pointArray[i + 1]; i < this.pointArray.length - 1; i++) {
		// 		// 竖线
		// 		if(Math.round(p.x) === Math.round(np.x)) {
		// 			p.x = np.y = Math.round(p.x) + 0.5;
		// 		}
		// 		// 横线
		// 		if(Math.round(p.y) === Math.round(np.y)) {
		// 			p.y = np.y = Math.round(p.y) + 0.5;
		// 		}		
		// 	}			
		// }



		this.pointArray.forEach(({ x, y }, index, array) => {
			if(index === 0)
				context.moveTo(x, y);
			else {
				let pp = array[index - 1];

				// /* 对 1px 进行坐标对齐 */
				// if(context.lineWidth === 1) {
				// 	// 竖线
				// 	if(Math.round(pp.x) === Math.round(x)) {

				// 		x = pp.x = Math.round(pp.x) + 0.5;

				// 	}
				// 	// 横线
				// 	if(Math.round(pp.y) === Math.round(y)) {

				// 		y = pp.y = Math.round(pp.y) + 0.5;

				// 	}
				// }

				/* 虚线 */
				if(this.isDashed) {
				    let dashLen = 5;  
				    let dx = x - pp.x;
				    let dy = y - pp.y;
				    var num = Math.floor(Math.sqrt(Math.pow(dx, 2)+  Math.pow(dy, 2))/dashLen);

				    for(let i = 0; i < num; i++) {
				    	let _x = pp.x + (dx)/num*i;
				    	let _y = pp.y + (dy)/num*i;

				        context[i%2 == 0 ? 'moveTo' : 'lineTo'](_x, _y);  
				    } 

				    context.lineTo(x, y);
				}
				/* 实线 */
				else {
					context.lineTo(x, y);			
				}				
			}
		}, this);

	}
}



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
	color: [
	    '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
	    '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
	    '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
	    '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
	],
	axis: {
		tick: {
			length: 8,
			margin: 4,
			color: '008acd'
		},
		label: {
			color: '#008acd'
		},
		grid: {
			color: '#eeeeee'
		}
	},
	legend: {
		shape: 'rect',
		width: 12,
		/* shape: 'circle'
		r: 6 */
		margin: 4
	}
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape_rect__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_circle__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_text__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__theme_macaron__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_util__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Legend; });






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
			let maxLegendWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__util_util__["b" /* max */])(lengthArray);
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
				
				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_circle__["a" /* Circle */]({
					x: this.x + this.width/2 - boundingWidth/2 + item.xOffset + r,
					y: y,
					r: r,
					style: {
						fillStyle: this.color[index]
					},
					renderType: 'fill'
				}));

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_text__["a" /* Text */]({
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

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_circle__["a" /* Circle */]({
					x: this.x + r,
					y: y,
					r: r,
					style: {
						fillStyle: this.color[index]
					},
					renderType: 'fill'
				}));

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_text__["a" /* Text */]({
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



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Geometry; });


class Geometry {
	constructor({ data, dim, x, y, width, height, render, space }) {
		this.data = data;
		this.dim = dim;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.render = render;
		this.space = space;

		this.onclick = function () {};
		this.onmousemove= function () {};
		this.onmouseover = function () {};
		this.onmouseout = function () {};
	}

	color(color) {
		this.color = color;
	}

	computeData() {
		let dim = this.dim;

		let xData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* unique */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["d" /* getCol */])(this.data, dim.x));
		let colorData = null;
		let yData = null;
		if(dim.color) {
			colorData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* unique */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["d" /* getCol */])(this.data, dim.color));
			yData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* group */])(this.data, dim.y, dim.x, dim.color);
		}
		else {
			yData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* group */])(this.data, dim.y, dim.x).map((group) => group.slice(0, 1));
		}

		return { xData, yData, colorData }	
	}

	computeTick(data, isBeginAtZero = false) {
		let _data = data.reduce((pre, cur) => pre.concat(cur), []);
		let maxData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(_data);
		let minData = isBeginAtZero ? Math.min(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* min */])(_data), 0) : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* min */])(_data);
		let tickArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["h" /* linearTick */])(minData, maxData);
		let minTick = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* min */])(tickArray);
		let maxTick = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(tickArray);

		return { minTick, maxTick };
	}

	on(shape, data) {
		let self = this;

		shape.addEventListener('click', function (context, x, y) {
			self.onclick(context, x, y, data);
		});

		shape.addEventListener('mousemove', function (context, x, y) {
			self.onmousemove(context, x, y, data);
		});

		shape.addEventListener('mouseover', function (context, x, y) {
			self.onmouseover(context, x, y, data);
		});

		shape.addEventListener('mouseout', function (context, x, y) {
			self.onmouseout(context, x, y, data);
		});
	}

	getShape() {
		return this.computeShape();
	}
}



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Polygon; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return RegularPolygon; });


class Polygon extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ vertexArray, style, renderType, groupId, zIndex }) {
		super({
			type: 'polygon',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		this.vertexArray = vertexArray;
	}

	buildPath(context) {
		this.vertexArray.forEach(function (vertex) {
			context.lineTo(vertex.x, vertex.y);
		}, this);
		context.lineTo(this.vertexArray[0].x, this.vertexArray[0].y);
	}
}

class RegularPolygon extends Polygon {
	constructor({ x, y, r, vertexNumber, style, renderType }) {
		super({
			vertexArray: new Array(vertexNumber).fill(0).map(function (item, index) {
				let radian = 2*Math.PI/vertexNumber;
				return {
					x: x + r*Math.cos(Math.PI/2 - index*radian),
					y: y - r*Math.sin(Math.PI/2 - index*radian)
				}
			}),
			style: style,
			renderType: renderType
		});
	}
}



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_line__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_text__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LinearAxis; });




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

		if(this.type === 'linear') {
			tickArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["h" /* linearTick */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* min */])(this.data), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.data));

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
		let context = this.render.getContext();

		let limitedLabelWidth = 0;
		let maxLabelWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.tickArray.map(tick => context.measureText(tick.value).width ));
		
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
				let { height } = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["i" /* getTextBoundingRect */])({
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

			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
				pointArray: [{ x: this.x, y: this.y }, { x: this.x + this.width, y: this.y }],
				style: lineStyle,
				zIndex: 1
			}));

			this.tickArray.forEach((tick) => {
				let x = this.x + tick.position;
				let y = this.y;
				/* 刻度线 */
				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
					pointArray: [{ x: x, y: y }, { x: x, y: y + 8 }],
					style: lineStyle,
				}));

				/* label */
				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_text__["a" /* Text */]({
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

					shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
						pointArray: [{ x: x, y: y }, { x: x, y: y - this.bodyHeight }],
						style: lineStyle,
						isDashed: true
					}));
				}, this);				
			}
		}
		/* 竖直坐标轴 */
		else if(/left|right/.test(this.position)) {
			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
				pointArray: [{ x: this.x + this.width, y: this.y }, { x: this.x + this.width, y: this.y + this.height }],
				style: lineStyle,
				zIndex: 1
			}));

			this.tickArray.forEach((tick, index) => {
				let x = this.x + this.width;
				let y = this.y + this.height - tick.position;

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
					pointArray: [{ x: x, y: y }, { x: x - 8, y: y }],
					style: lineStyle
				}));

				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_text__["a" /* Text */]({
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

					shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
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
		this.update();
		return this.shapeArray;
	}
}



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_line__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_circle__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shape_polygon__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shape_text__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ThetaAxis; });






class ThetaAxis {
	constructor({ type = 'polar', thetaData, rData, x, y, width, height, tickCount = 5 }) {
		this.type = type;
		this.thetaData = thetaData;
		this.rData = rData;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = Math.min(width, height)/2 - 2*12;

		this.tickCount = tickCount;
	}

	computeShape() {
		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let tickArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["h" /* linearTick */])(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(this.rData), this.tickCount);
		let shapeArray = [];
		this.thetaData.forEach((item, index, array) => {
			let interval = 2*Math.PI/array.length;

			let radian = 3/2*Math.PI + index*interval;

			let x = cx + this.r*Math.cos(radian);
			let y = cy + this.r*Math.sin(radian);

			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_1__shape_line__["a" /* Line */]({
				pointArray: [{ x: cx, y: cy }, { x: x, y: y }],
				style: {
					lineWidth: 1,
					strokeStyle: '#d9d9d9'					
				},
				isDashed: true
			}));
			if(this.type === 'polar')
				radian += interval/2;
			let textX = cx + (this.r + 12)*Math.cos(radian);
			let textY = cy + (this.r + 12)*Math.sin(radian);

			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_4__shape_text__["a" /* Text */]({
				x: textX,
				y: textY,
				value: item,
				rotate: 1/2*Math.PI + radian,
				style: {
					textAlign: 'center',
					textBaseline: 'bottom',	
					fillStyle: '#222222'	
				}
			}));
		});

		let T = this.type === 'polar' ? __WEBPACK_IMPORTED_MODULE_2__shape_circle__["a" /* Circle */] : __WEBPACK_IMPORTED_MODULE_3__shape_polygon__["b" /* RegularPolygon */];

		tickArray.forEach((tick, index, array) => {
			shapeArray.push(new T({
				x: cx,
				y: cy,
				r: index*this.r/(array.length - 1),
				vertexNumber: this.thetaData.length,
				renderType: 'stroke',
				style: {
					lineWidth: 1,
					strokeStyle: index === array.length - 1 ? '#d9d9d9' : '#d9d9d9'
				}
			}));

			shapeArray.push(new __WEBPACK_IMPORTED_MODULE_4__shape_text__["a" /* Text */]({
				x: cx ,
				y: cy - index*this.r/(array.length - 1),
				value: tick,
				style: {
					textAlign: 'center',
					textBaseline: 'middle'
				}
			}));
		}, this);

		return shapeArray;
	}

	getShape() {
		return this.computeShape();
	}
}



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape_text__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_round_rect__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_util__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToolTip; });




let padding = 6;
let r = 6;
let margin = 6;
let fontSize = 12;

class ToolTip {
	constructor({ data, x, y, chartBody, render }) {
		this.data = data;
		this.x = x;
		this.y = y;
		this.chartBody = chartBody;	
		this.render = render;

		this.id = `tooltip-${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__util_util__["f" /* uuid */])()}`;

		this.textArray = [];
		this.shapeArray = [];

		this.isDisplay = false;
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

	move() {
		let { x, y, width, height } = this.computeBoundingRect();

		this.shapeArray.forEach((shape, index) => {
			if(shape instanceof __WEBPACK_IMPORTED_MODULE_0__shape_text__["a" /* Text */]) {
				shape.x = x + padding;
				shape.y = y + padding + fontSize/2 + (index - 1)*(fontSize + margin);
			}
			else if(shape instanceof __WEBPACK_IMPORTED_MODULE_1__shape_round_rect__["a" /* RoundRect */]) {
				shape.x = x;
				shape.y = y;
			}
		}, this);

		this.render.requestRender();
	}

	computeText() {
		let textArray = [];
		for(let key in this.data) {
			if(this.data[key])
				textArray.push(`${key}: ${this.data[key]}`);
		}
		return textArray;	
	}

	computeBoundingRect() {
		let context = this.render.getContext();

		let maxTextWidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__util_util__["b" /* max */])(this.textArray.map(text => context.measureText(text).width));

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

		return { x, y, width, height };		
	}

	computeShape() {
		let { x, y, width, height } = this.computeBoundingRect();

		let roundRect = new __WEBPACK_IMPORTED_MODULE_1__shape_round_rect__["a" /* RoundRect */]({
			x: x,
			y: y,
			width: width,
			height: height,
			r: r,
			style: {
				fillStyle: 'rgba(50,50,50,0.8)'
			},
			groupId: this.id,
			zIndex: 2
		});

		let textArray = this.textArray.map((text, index) => {
			return new __WEBPACK_IMPORTED_MODULE_0__shape_text__["a" /* Text */]({
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
		this.textArray = this.computeText();
		this.shapeArray = this.computeShape();
		return this.shapeArray;
	}
}



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__geometry_bar__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__geometry_line__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__geometry_point__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__geometry_pie__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__geometry_radar__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__axis_theta__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__axis_linear__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__legend_legend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__tooltip_tooltip__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__shape_rect__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__leerender__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__theme_macaron__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__util_util__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LeeChart; });














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
			this[`${prefix}Render`] = new __WEBPACK_IMPORTED_MODULE_10__leerender__["a" /* LeeRender */](canvas);

			this.container.appendChild(canvas);
		}, this);

		this.box = {
			left: [],
			right: [],
			top: [],
			bottom: []
		};

		this.isStacked = false;
	}

	type(_type) {
		if(/line|point|bar|pie|doughnut|polar|radar/.test(_type))
			this._type = _type;
		return this;
	}

	stack(isStacked = true) {
		this.isStacked = isStacked;
	}

	area(isArea = true) {
		this.isArea = isArea;
	}

	data(_data) {
		if(Array.isArray(_data))
			this._data = _data;
		return this;
	}

	x(col) {
		if(/line|point|bar/.test(this._type)) {
			this._xCol = col;
			this._xData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__util_util__["c" /* unique */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__util_util__["d" /* getCol */])(this._data, col));
		}
		
		return this;
	}

	y(col) {
		if(/line|point|bar/.test(this._type)) {
			this._yCol = col;
			this._yData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__util_util__["e" /* group */])(this._data, col, this._xCol, this._colorCol);
		}
			
		return this;
	}

	theta(col) {
		if(/pie|doughnut|polar|radar/.test(this._type)) {
			this._thetaCol = col;
			this._thetaData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__util_util__["e" /* group */])(this._data, col, this._colorCol);
		}
			
		return this;			
	}

	r(col) {
		if(/pie|doughnut|polar|radar/.test(this._type)) {
			this._rCol = col;
			this._rData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__util_util__["e" /* group */])(this._data, col, this._thetaCol, this._colorCol);
		}
			
		return this;
	}

	color(col) {
		this._colorCol = col;
		this._colorData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__util_util__["c" /* unique */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__util_util__["d" /* getCol */])(this._data, col));

		return this;
	}

	/* 构建坐标轴和图表 */
	build() {
		this._legend = new __WEBPACK_IMPORTED_MODULE_7__legend_legend__["a" /* Legend */]({
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

			this._xAxis = new __WEBPACK_IMPORTED_MODULE_6__axis_linear__["a" /* LinearAxis */]({
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

			this._yAxis = new __WEBPACK_IMPORTED_MODULE_6__axis_linear__["a" /* LinearAxis */]({
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
				this._chart = new __WEBPACK_IMPORTED_MODULE_0__geometry_bar__["a" /* BarChart */](config);
			}
			else if(this._type === 'line') {
				this._chart = new __WEBPACK_IMPORTED_MODULE_1__geometry_line__["a" /* LineChart */](config);
			}
			else
				this._chart = new __WEBPACK_IMPORTED_MODULE_2__geometry_point__["a" /* PointChart */](config);				
		}
		else if(/pie|doughnut|polar|radar/.test(this._type)) {
			let dim = {
				theta: this._thetaCol,
				color: this._colorCol
			};

			if(/polar|radar/.test(this._type)) {
				dim.r = this._rCol;
				this._thetaAxis = new __WEBPACK_IMPORTED_MODULE_5__axis_theta__["a" /* ThetaAxis */]({
					type: this._type,
					thetaData: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__util_util__["c" /* unique */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__util_util__["d" /* getCol */])(this._data, this._thetaCol)),
					rData: this._rData.reduce((pre, cur) => pre.concat(cur), []),
					x: this.padding.left,
					y: this.padding.top,
					width: this.bodyWidth,
					height: this.bodyHeight				
				});
			}

			let T = this._type === 'radar' ? __WEBPACK_IMPORTED_MODULE_4__geometry_radar__["a" /* RadarChart */] : __WEBPACK_IMPORTED_MODULE_3__geometry_pie__["a" /* PieChart */];

			this._chart = new T({
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

		let color = __WEBPACK_IMPORTED_MODULE_11__theme_macaron__["a" /* default */].color.slice(0, Math.max(colorData.length, 1))
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

		if(this._type === 'polar' || this._type === 'radar') {
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

		this._toolTip = new __WEBPACK_IMPORTED_MODULE_8__tooltip_tooltip__["a" /* ToolTip */]({
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
		else if(/polar|radar/.test(this._type))
			this.backRender.addShape(this._thetaAxis.getShape());
		this.bodyRender.addShape(this._chart.getShape());
		this.frontRender.addShape(this._legend.getShape());

		this.backRender.requestRender();
		this.bodyRender.requestRender();
		this.frontRender.requestRender();
	}
}



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_rect__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tooltip_tooltip__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__geometry__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BarChart; });





let margin = 6;

class BarChart extends __WEBPACK_IMPORTED_MODULE_3__geometry__["a" /* Geometry */] {
	constructor({ data, dim, x, y, width, height, render, space, isStacked = true, isBeginAtZero = false }) {
		super({ data, dim, x, y, width, height, render, space });

		this.isStacked = isStacked;
		this.isBeginAtZero = isBeginAtZero
	}

	computeShape() {
		let dim = this.dim;
		let { xData, yData, colorData } = this.computeData();

		let space = this.space;
		let intervalWidth = (this.width - 2*space)/yData.length;
		let areaWidth = 0.8*intervalWidth;
		let barWidth = (areaWidth - (yData[0].length - 1)*margin)/yData[0].length;
		if(this.isStacked)
			barWidth = areaWidth

		let { minTick, maxTick } = this.computeTick(yData, this.isBeginAtZero);
		if(this.isStacked) {
			let result = this.computeTick(yData.map(group => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["g" /* sum */])(group)), this.isBeginAtZero);
			maxTick = result.maxTick;
		}

		let shapeArray = yData.map((group, groupIndex) => {

			let startX = this.x + space + groupIndex*intervalWidth + intervalWidth/2 - areaWidth/2;
			let heap = 0;
			let rectGroup = group.map((item, index) => {

				let x = startX + index*(barWidth + margin);
				let barHeight = this.height*(item - minTick)/(maxTick - minTick);
				let y = this.y + this.height - barHeight;
				let color = dim.color ? this.color[index] : this.color[groupIndex]

				if(this.isStacked) {
					x = startX;
					y = this.y + this.height - heap - barHeight;
				}

				let rect = new __WEBPACK_IMPORTED_MODULE_1__shape_rect__["a" /* Rect */]({
					x: x,
					y: y,
					width: barWidth,
					height: barHeight,
					style: {
						fillStyle: color
					},
					isAnimation: true
				});

				rect.init({ y: y + barHeight, height: 0 }).when(1000, { y: y, height: barHeight }).start();

				let obj = {
					[dim.x]: xData[groupIndex],
					[dim.y]: yData[groupIndex][index]			
				};
				if(colorData)
					obj[dim.color] = colorData[index];

				this.on(rect, obj);
				heap += barHeight; 
				return rect;
			}, this);

			return rectGroup;
		}, this);

		return shapeArray.reduce((pre, cur) => pre.concat(cur), []);
	}
}



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_circle__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_line__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shape_bezier_curve__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__shape_polygon__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shape_custom_shape__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__geometry__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LineChart; });








class LineChart extends __WEBPACK_IMPORTED_MODULE_6__geometry__["a" /* Geometry */] {
	constructor({ data, dim, x, y, width, height, render, space, isBezierCurve = false, isArea = true, isStacked = false, isBeginAtZero = false }) {
		super({ data, dim, x, y, width, height, render, space });

		this.isBezierCurve = isBezierCurve;
		this.isArea = isArea;
		this.isBeginAtZero = isBeginAtZero;
	}

	computeShape() {
		let dim = this.dim;
		let { xData, yData, colorData } = this.computeData();

		let space = this.space;
		let intervalWidth = (this.width - 2*space)/(yData.length - 1);

		let { minTick, maxTick } = this.computeTick(yData, this.isBeginAtZero);
		if(this.isStacked)
			maxTick = this.computeTick(yData.map(group => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["g" /* sum */])(group)), this.isBeginAtZero);

		let T = this.isBezierCurve ? __WEBPACK_IMPORTED_MODULE_3__shape_bezier_curve__["a" /* BezierCurve */] : __WEBPACK_IMPORTED_MODULE_2__shape_line__["a" /* Line */];

		let shapeArray = [];
		let pointGroup = [];

		yData.forEach((group, groupIndex) => {

			group.forEach((item, index) => {
				let x = this.x + space + groupIndex*intervalWidth;
				let pointHeight = this.height*(item - minTick)/(maxTick - minTick);
				let y = this.y + this.height - pointHeight;

				let circle = new __WEBPACK_IMPORTED_MODULE_1__shape_circle__["a" /* Circle */]({
					x: x,
					y: y,
					r: 3,
					style: {
						fillStyle: '#ffffff',
						strokeStyle: this.color[index],
						lineWidth: 2
					},
					renderType: 'fillstroke',
					zIndex: 2,
					isAnimation: true
				});

				let obj = {
					[dim.x]: xData[groupIndex],
					[dim.y]: yData[groupIndex][index]			
				};
				if(colorData)
					obj[dim.color] = colorData[index];

				this.on(circle, obj);

				shapeArray.push(circle);

				pointGroup[index] = pointGroup[index] || [];
				pointGroup[index].push({ x, y });
			}, this);
		}, this);

		pointGroup.forEach((array, index) => {
			let maxY = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* max */])(array.map(({ x, y }) => y));

			let line = new T({
				pointArray: array,
				style: {
					strokeStyle: this.color[index],
					lineWidth: 2,
				},
				zIndex: 1,
				isAnimation: true			
			});

			line.init({
				pointArray: array.map(({ x, y }) => {
					return { x: x, y: maxY }
				})
			}).when(1000, {
				pointArray: array
			}).start();

			shapeArray.push(line);

			if(this.isArea) {
				let minX = array[0].x;					
				let maxX = array[array.length - 1].x;
				let y = this.y + this.height;


				if(this.isBezierCurve) {

					let area = new __WEBPACK_IMPORTED_MODULE_5__shape_custom_shape__["a" /* CustomShape */]({
						config: {
							sx: minX,
							sy: y,
							ex: maxX,
							ey: y,
							bezierArray: array							
						},
			
						renderType: 'fill',
						style: {
							fillStyle: this.color[index],
							globalAlpha: 0.5
						},
						zIndex: 0,
						buildPath: function (context) {
							context.moveTo(this.sx, this.sy);
							this.bezierArray.forEach(({ x, y }, index, array) => {
								if(index === 0)
									context.lineTo(x, y);
								else {
									let midX = (array[index - 1].x + x)/2;
									let preY = array[index - 1].y;
									context.bezierCurveTo(midX, preY, midX, y, x, y);
								}
							});	
							context.lineTo(this.ex, this.ey);

							context.closePath();							
						}
					});

					area.init({
						sx: minX,
						y: y,
						ex: maxX,
						ey: y,
						bezierArray: array.map(({ x }) => {
							return { x: x, y: y }
						})
					}).when(1000, {
						sx: minX,
						y: y,
						ex: maxX,
						ey: y,
						bezierArray: array.map(({ x, y }) => {
							return { x: x, y: y }
						})			
					}).start();

					shapeArray.push(area);
				}
				else {
					let vertexArray = array.map(({ x, y }) => {
						return { x, y };
					});
					vertexArray.unshift({ x: minX, y: y })
					vertexArray.push({ x: maxX, y: y })
					vertexArray.push({ x: minX, y: y });

					let polygon = new __WEBPACK_IMPORTED_MODULE_4__shape_polygon__["a" /* Polygon */]({
						vertexArray: vertexArray,
						renderType: 'fill',
						style: {
							fillStyle: this.color[index],
							globalAlpha: 0.50
						},
						zIndex: 0
					});

					polygon.init({
						vertexArray: [{ x: minX, y: y }].concat(array.map(({ x }) => {
							return { x, y }
						})).concat([{ x: maxX, y: y }, { x: minX, y: y }])
					}).when(1000, {
						vertexArray: vertexArray.map(({ x, y }) => {
							return { x, y }
						})
					}).start();

					shapeArray.push(polygon);
				}
			}
		}, this);


		return shapeArray;
	}
}



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_line__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_sector__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__geometry__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PieChart; });





class PieChart extends __WEBPACK_IMPORTED_MODULE_3__geometry__["a" /* Geometry */] {
	constructor({ data, dim, x, y, width, height, render, space, type = 'pie' }) {
		super({ data, dim, x, y, width, height, render, space });

		this.type = type;
	}

	computeShape() {
		let dim = this.dim;

		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let innerRadius = 0;
		let radius = Math.min(this.width, this.height)/2;
		let lastRadian = 3/2*Math.PI;

		let thetaData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* unique */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["d" /* getCol */])(this.data, dim.theta));
		let colorData = dim.color ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* unique */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["d" /* getCol */])(this.data, dim.color)) : null;
		let data = null;
		if(this.type === 'polar') {
			/* theta r color */
			if(dim.color && dim.color !== dim.theta)
				data = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* group */])(this.data, dim.r, dim.theta, dim.color);
			else
				data = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* group */])(this.data, dim.r, dim.theta).map((group) => group.slice(0, 1));
		}
		else {
			data = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* group */])(this.data, dim.theta, dim.color).map((group) => group.slice(0, 1));
		}

		let sumData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["g" /* sum */])(data.reduce((pre, cur) => pre.concat(cur), []));
		let { minTick, maxTick } = this.computeTick(data.map(group => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["g" /* sum */])(group)), true);

		let shapeArray = [];

		data.forEach((group, groupIndex, array) => {

			let radian = 0;
			let r = 0;
			if(this.type === 'polar') {
				radian = 2*Math.PI/array.length;
			}
			else {
				innerRadius = this.type === 'doughnut' ? (0.5*radius) : 0;
				r = radius;
			}

			let lastR = 0;
			group.forEach((item, index, array) => {

				let color = null;
				if(this.type === 'polar') {

					innerRadius = lastR;
					r = lastR + radius*(item - minTick)/(maxTick - minTick);
					color = this.color[index];
				}
				else {
					color = this.color[groupIndex];
					radian = 2*Math.PI*item/sumData;
				}
					
				let sector = new __WEBPACK_IMPORTED_MODULE_2__shape_sector__["a" /* Sector */]({
					x: cx,
					y: cy,
					innerRadius: innerRadius,
					outerRadius: r,
					startRadian: lastRadian,
					endRadian: lastRadian + radian,
					renderType: 'fillstroke',
					style: {
						fillStyle: color,
						strokeStyle: '#ffffff',
						lineWidth: 2
					},
					zIndex: 0,
					isAnimation: true
				});

				let obj = {};

				if(this.type === 'polar') {
					obj = {
						[dim.theta]: thetaData[groupIndex],
						[dim.r]: data[groupIndex][index]
					};
					if(colorData)
						obj[dim.color] = colorData[index]
				}
				else {
					obj = {
						[dim.color]: colorData[groupIndex],
						[dim.theta]: data[groupIndex][index]			
					};			
				}

				this.on(sector, obj);

				sector.init({
					startRadian: 0,
					endRadian: 0
				}).when(1000, {
					startRadian: lastRadian,
					endRadian: lastRadian + radian
				}).start();

				lastR = r;

				shapeArray.push(sector);		
			}, this);

			lastRadian = lastRadian + radian;
		}, this);

		return shapeArray;
	}
}



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_circle__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__geometry__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PointChart; });




class PointChart extends __WEBPACK_IMPORTED_MODULE_2__geometry__["a" /* Geometry */] {
	constructor({ data, dim, x, y, width, height, render, space, isBeginAtZero = false }) {
		super({ data, dim, x, y, width, height, render, space });

		this.isBeginAtZero = isBeginAtZero;
	}
	
	computeShape() {
		let dim = this.dim;
		let { xData, yData, colorData } = this.computeData();

		let intervalWidth = (this.width - 2*this.space)/(yData.length - 1);

		let { minTick, maxTick } = this.computeTick(yData, this.isBeginAtZero);

		return yData.map((group, groupIndex) => {
			return group.map((item, index) => {
				let x = this.x + this.space + groupIndex*intervalWidth;

				let pointHeight = this.height*(item - minTick)/(maxTick - minTick);
				let y = this.y + this.height - pointHeight;

				let r = 6 + 18*(item - minTick)/(maxTick - minTick);

				let circle = new __WEBPACK_IMPORTED_MODULE_1__shape_circle__["a" /* Circle */]({
					x: x,
					y: y,
					r: r,
					renderType: 'fill',
					style: {
						fillStyle: this.color[index],
						globalAlpha: 0.5
					},
					isAnimation: true
				});

				let obj = {
					[dim.x]: xData[groupIndex],
					[dim.y]: yData[groupIndex][index]			
				};
				if(colorData)
					obj[dim.color] = colorData[index];

				this.on(circle, obj);

				circle.init({ r: 0 }).when(1000, { r: r }).start();

				return circle;
			}, this);
		}, this).reduce((pre, cur) => pre.concat(cur), []);
	}
}



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__shape_polygon__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__shape_circle__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__geometry__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RadarChart; });





class RadarChart extends __WEBPACK_IMPORTED_MODULE_3__geometry__["a" /* Geometry */] {
	constructor({ data, dim, x, y, width, height, render, space }) {
		super({ data, dim, x, y, width, height, render, space });
	}

	computeShape() {
		let dim = this.dim;
		let rData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* group */])(this.data, dim.r, dim.theta, dim.color);
		if(!dim.color || dim.color === dim.theta)
			rData = rData.map(group => group.slice(0, 1));

		let { minTick, maxTick } = this.computeTick(rData, true);
		let shapeArray = [];
		let cx = this.x + this.width/2;
		let cy = this.y + this.height/2;
		let r = Math.min(this.width, this.height)/2;
		let vertexArray = [];
		rData.forEach((group, groupIndex, array) => {
			let interval = 2*Math.PI/array.length;
			let radian = 3/2*Math.PI + groupIndex*interval;

			group.forEach((item, index) => {

				vertexArray[index] = vertexArray[index] || [];
				let _r = r*(item - minTick)/(maxTick - minTick);
				let x = cx + _r*Math.cos(radian);
				let y = cy + _r*Math.sin(radian);
				shapeArray.push(new __WEBPACK_IMPORTED_MODULE_2__shape_circle__["a" /* Circle */]({
					x: x,
					y: y,
					r: 2,
					style: {
						fillStyle: this.color[index],
						renderType: 'fill'
					}
				}))
				vertexArray[index].push({ x, y });
			}, this);
		}, this);

		vertexArray.forEach((group, index) => {
			let polygon = new __WEBPACK_IMPORTED_MODULE_1__shape_polygon__["a" /* Polygon */]({
				vertexArray: group,
				style: {
					strokeStyle: this.color[index],
					fillStyle: this.color[index],
					lineWidth: 2,
					globalAlpha: 0.4
				},
				renderType: 'fillstroke'
			});

			polygon.init({
				vertexArray: group.map(vertex => {
					return { x: cx, y: cy }
				})
			}).when(1000, {
				vertexArray: group
			}).start();

			shapeArray.push(polygon);
		}, this);

		return shapeArray;
	}

	getShape() {
		return this.computeShape();
	}
}



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BezierCurve; });




class BezierCurve extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ pointArray, style, groupId, zIndex, isAnimation }) {
		super({
			type: 'bezier-curve',
			style: style,
			renderType: 'stroke',
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.originalPointArray = pointArray;
		this.pointArray = pointArray.map(({ x, y }) => {
			return { x: x, y: y }
		});
	}

	buildPath(context) {
		this.pointArray.forEach(({ x, y }, index, array) => {
			if(index === 0)
				context.moveTo(x, y);
			else {
				let midX = (array[index - 1].x + x)/2;
				let preY = array[index - 1].y;
				context.bezierCurveTo(midX, preY, midX, y, x, y);
			}
		});
	}	
}



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomShape; });


class CustomShape extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ config, style, renderType, groupId, zIndex, buildPath = function (context) {} }) {
		super({
			type: 'custom',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex
		});

		for(let attr in config)
			this[attr] = config[attr];

		this.buildPath = buildPath;
	}
}



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RoundRect; });


class RoundRect extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ x, y, width, height, r, style, renderType, groupId, zIndex, isDisplay }) {
		super({
			type: 'round-rect',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isDisplay: isDisplay
		});

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.r = r;
	}

	buildPath(context) {
		context.arc(this.x + this.r, this.y + this.r, this.r, Math.PI, 3/2*Math.PI);
		context.lineTo(this.x + this.width - this.r, this.y);

		context.arc(this.x + this.width - this.r, this.y + this.r, this.r, 3/2*Math.PI, 2*Math.PI);
		context.lineTo(this.x + this.width, this.y + this.height - this.r);

		context.arc(this.x + this.width - this.r, this.y + this.height - this.r, this.r, 0, Math.PI/2);
		context.lineTo(this.x + this.r, this.y + this.height);

		context.arc(this.x + this.r, this.y + this.height - this.r, this.r, Math.PI/2, Math.PI);

		context.closePath();
	}
}



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shape__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_easing__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Sector; });



class Sector extends __WEBPACK_IMPORTED_MODULE_0__shape__["a" /* Shape */] {
	constructor({ x, y, innerRadius, outerRadius, startRadian, endRadian, style, renderType, groupId, zIndex, isAnimation }) {
		super({
			type: 'sector',
			style: style,
			renderType: renderType,
			groupId: groupId,
			zIndex: zIndex,
			isAnimation: isAnimation
		});

		this.x = x;
		this.y = y;
		this.innerRadius = innerRadius;
		this.outerRadius = outerRadius;

		this.originalStartRadian = startRadian;
		this.startRadian = startRadian;

		this.originalEndRadian = endRadian;
		this.endRadian = endRadian;

	}

	buildPath(context) {
		context.moveTo(this.x + this.innerRadius*Math.cos(this.startRadian),
			this.y + this.innerRadius*Math.sin(this.startRadian));
		context.lineTo(this.x + this.outerRadius*Math.cos(this.startRadian),
			this.y + this.outerRadius*Math.sin(this.startRadian));

		context.arc(this.x, this.y, this.outerRadius, this.startRadian, this.endRadian, false);

		context.lineTo(this.x + this.innerRadius*Math.cos(this.endRadian),
			this.y + this.innerRadius*Math.sin(this.endRadian));

		context.arc(this.x, this.y, this.innerRadius, this.endRadian, this.startRadian, true);
	}
}



/***/ }),
/* 25 */,
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_leechart__ = __webpack_require__(15);


let month = ['Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'];
let data = [
	{ name: 'Tokyo', data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4] },
	{ name: 'New York', data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3] },
	{ name: 'London', data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2] },
	{ name: 'Berlin', data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1] }
].reduce(function (pre, cur) {
	let array = cur.data.map((rainfall, index) => {
		return {
			name: cur.name,
			month: month[index],
			rainfall: rainfall
		}
	});

	return pre.concat(array);
}, []);

let pointChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#point'));
pointChart.type('point').data(data).color('name').x('month').y('rainfall').render();

let lineChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#line'));
lineChart.type('line').data(data).color('name').x('month').y('rainfall').render();

let barChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#bar'));
barChart.type('bar').data(data).color('name').x('month').y('rainfall').render();

let pieChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#pie'));
pieChart.type('pie').data(data).color('name').theta('rainfall').render();

let doughnutChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#doughnut'));
doughnutChart.type('doughnut').data(data).color('name').theta('rainfall').render();

let polarChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#polar'));
polarChart.type('polar').data(data).color('name').theta('month').r('rainfall').render();

let radarChart = new __WEBPACK_IMPORTED_MODULE_0__src_leechart__["a" /* LeeChart */](document.querySelector('#radar'));
radarChart.type('radar').data(data).color('name').theta('month').r('rainfall').render();

/***/ })
/******/ ]);