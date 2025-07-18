#include <clipping_planes_pars_vertex>
// -
varying vec2 vUv;
varying vec3 vPosition;
// -
uniform float u_time;
uniform float u_progress;
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