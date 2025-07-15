vUv = uv;
vec3 pos = position;
// -
vec3 axis = vec3(1., 1., 0.);
float twist = u_progress * PI;
float angle = (pos.y * twist);
transformed = rotate(pos, axis, angle);

// -
vec4 mvPosition = vec4( transformed, 1.0 );

#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif

#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif

mvPosition = modelViewMatrix * mvPosition;

gl_Position = projectionMatrix * mvPosition;
