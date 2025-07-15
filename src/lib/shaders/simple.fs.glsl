#ifndef GL_FRAGMENT_PRECISION_HIGH
	precision mediump float;
#else
	precision highp float;
#endif

varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D map;
// -
void main(){
	gl_FragColor = texture2D(map, vUv);
	//gl_FragColor.a = 1.0;
	//gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
}