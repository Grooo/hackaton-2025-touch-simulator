precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D u_input_texture;
uniform float u_ratio;

uniform vec3 u_point_value;
uniform vec2 u_point;
uniform float u_point_size;

uniform vec3 u_point2_value;
uniform vec2 u_point2;
uniform float u_point2_size;

uniform sampler2D u_text_texture;


void main () {
	vec2 p = vUv - u_point.xy;
	p.x *= u_ratio;
	vec3 splat = pow(2., -dot(p, p) / u_point_size) * u_point_value;

	vec2 p2 = vUv - u_point2.xy;
	p2.x *= u_ratio;
	vec3 splat2 = pow(2., -dot(p2, p2) / u_point2_size) * u_point2_value;

	//float text = texture2D(u_text_texture, vec2(vUv.x, 1. - vUv.y)).r;
	//splat *= (.5 + .5 * splat2);

	//vec3 base = vec3(0.);
	vec3 base = texture2D(u_input_texture, vUv).xyz;
	gl_FragColor = vec4(base + splat + splat2, 1.);
}
