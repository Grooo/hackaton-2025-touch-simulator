
export function array2Polygon( _arr ){
	let clipPath = 'polygon(';
	// -
	_arr.forEach((v,i) => {
		clipPath += `${v.x}% ${v.y}%, `;
	});
	// -
	clipPath = clipPath.slice(0, -2);
	clipPath +=')';
	// -
	return clipPath;
}

// -
export function polygon2Array( _str ){
	const reg = /([0-9.-]+)%\s*\s([0-9.-]+)%\s*/g;
	const regCoords = /([0-9.-]+)/g;
	// -
	let result, points = [];
	// -
	_str.match(reg).forEach((result, i) => {
		const v = result.match(regCoords);
		// -
		points.push({
			x: Number(v[0]), 
			y: Number(v[1])
		});
	});
	// -
	return points;
}

// -
export function polygon2Point( _str, _x, _y ){
	const reg = /([0-9.-]+)%\s*\s([0-9.-]+)%\s*/g;
	const regCoords = /([0-9.-]+)/g;
	// -
	let result, points = [];
	// -
	_str.match(reg).forEach((result, i) => {
		const v = result.match(regCoords);
		// -
		points.push({
			x: _x, 
			y: _y
		});
	});
	// -
	return array2Polygon(points);
}