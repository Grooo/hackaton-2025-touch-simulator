#ifndef GL_FRAGMENT_PRECISION_HIGH
	precision mediump float;
#else
	precision highp float;
#endif

// -
varying vec2 vUv;
varying vec3 vPosition;
// -
uniform float u_time;
uniform float u_progress;
// -
float PI = 3.141592653589793238;
// -
mat4 rotation3d(vec3 axis, float angle) {
	axis = normalize(axis);
	float s = 	sin(angle);
	float c = 	cos(angle);
	float oc =	1.0 - c;
	return mat4(
		oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,  0.0,
		oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,  0.0,
		oc * axis.x * axis.z - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c, 0.0,
		0.0, 0.0, 0.0, 1.0
	);
}
vec3 rotate(vec3 v, vec3 axis, float angle) {
  return (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;
}
// -
void main() {
	vUv = uv;
	vec3 pos = position;
	// -
	vec3 axis = vec3(1., 1., 0.);
	float twist = u_progress * PI;
	float angle = (pos.y * twist);
	vec3 transformed = rotate(pos, axis, angle);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
}
