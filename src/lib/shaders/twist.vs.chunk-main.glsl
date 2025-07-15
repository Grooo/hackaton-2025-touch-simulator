vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif

#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif

// -
vec3 pos = mvPosition.xyz;
// -
vec3 axis = vec3(1., 1., 0.);
float twist = u_progress * PI;
float angle = (pos.y * twist);
vec3 transformation = rotate(pos, axis, angle);
// -

gl_Position = projectionMatrix * modelViewMatrix * vec4(transformation, 1.);
