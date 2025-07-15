import adapter from '@sveltejs/adapter-auto'

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {

	//preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
	},

	preprocess: preprocess({
		postcss: true,
		autoprefixer: true,
		cssnano: true,
		stylus: true,
		pug: true,
	})
};

export default config;
