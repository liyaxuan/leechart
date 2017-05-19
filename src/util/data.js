

class Data {
	static unique(array) {
		let result = [];
		let set = new Set(array);
		for(let item of set.keys())
			result.push(item);
		return result;
	}

	constructor(data) {
		this.data = data;
	}

	col(col) {
		return this.data.map(item => item[col]);
	}

	group(dim1, dim2) {
		let dim1Array = unique(this.col(dim1));
		let dim2Array = dim2 ? unique(this.col(dim2)) : [];

		let result = [];

		this.data.forEach((item) => {
			let i = dim1Array.findIndex(dim1Item => dim1Item === item[dim1]);		
			result[i] = result[i] || [];
			if(dim2) {
				let j = dim2Array.findIndex(dim2Item => dim2Item === item[dim2]);
				result[i][j] = item;
			}
			else
				result[i].push(item);
		});

		return result;
	}
}