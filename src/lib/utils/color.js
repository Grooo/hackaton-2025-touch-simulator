export function brightness(hex, percent){
	// strip the leading # if it's there
	hex = hex.replace(/^\s*#|\s*$/g, '');

	// convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
	if(hex.length == 3) hex = hex.replace(/(.)/g, '$1$1');
	// -
	var r = parseInt(hex.substr(0, 2), 16),
		g = parseInt(hex.substr(2, 2), 16),
		b = parseInt(hex.substr(4, 2), 16);

	return '#' +
	   ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
	   ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
	   ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
}

export function colorChannelMixer(_ch1, _ch2, _amount){
	const ch1 = _ch1 * ( 1 - _amount );
	const ch2 = _ch2 * _amount;
	// -
	return parseInt( ch1 + ch2 );
}

export function colorMixer( rgbA, rgbB, _amount ){
	const r = colorChannelMixer( rgbA[0], rgbB[0], _amount );
	const g = colorChannelMixer( rgbA[1], rgbB[1], _amount );
	const b = colorChannelMixer( rgbA[2], rgbB[2], _amount );
	// - 
	return `rgb(${r},${g},${b})`;
}


// - Convertions
export function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if(result){
		return  {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		};
	}
	// - Error
	console.warn( 'Bad Hex:', hex );
	return { r:0, g:0, b:0 };
}

export function hexToRgbArray(hex){
	const rgb = hexToRgb(hex);
	return [rgb.r, rgb.g, rgb.b];
}

export function hexToRgbCSS(hex){
	const rgb = hexToRgb(hex);
	return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
export function hexToRgbaCSS(hex, alpha){
	const rgb = hexToRgb(hex);
	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}


// - 
export function channelToHex(c) {
	var hex = c.toString(16);
	return hex.length === 1 ? `0${hex}` : hex;
}
export function rgbToHex(r, g, b) {
	return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
}

export function luminance(hex) {
    var a = hexToRgbArray(hex).map( (v)=> {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
// - 
export function contrast(hex1, hex2) {
    var lum1 = luminance(hex1);
    var lum2 = luminance(hex2);
	// - 
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
	// - 
	// - Minimal recommended contrast ratio is 4.5, or 3 for larger font-sizes
    return (brightest + 0.05)
         / (darkest + 0.05);
}

export function correctOverColor(hex, light, dark, threshold=4.5 ){
	// - AA large text: 3, AA small text: 4.5
	// - AAA large text: 4.5, AAA small text: 7
	if( contrast(hex, light) < threshold ){
		return dark;
	}
	return light;
}

export function overColorIsDark(hex, light, dark, threshold=4.5 ){
	const color = correctOverColor(hex, light, dark, threshold );
	if( color === light ){
		return true;
	}
	return false;
}