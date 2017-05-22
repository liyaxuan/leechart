import { Shape } from './shape';

class CustomShape extends Shape {
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

export { CustomShape }