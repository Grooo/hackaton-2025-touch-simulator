import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.DfvslztG.js","_app/immutable/chunks/v-UtOhs2.js","_app/immutable/chunks/N_rZzCOz.js","_app/immutable/chunks/ZirrBFTj.js","_app/immutable/chunks/CEsNSxbl.js"];
export const stylesheets = ["_app/immutable/assets/0.Curydr74.css"];
export const fonts = [];
