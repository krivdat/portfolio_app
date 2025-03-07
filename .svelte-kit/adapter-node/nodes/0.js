import * as server from '../entries/pages/_layout.server.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.js";
export const imports = ["_app/immutable/nodes/0.DZ5Tnrk5.js","_app/immutable/chunks/sHUU7htf.js","_app/immutable/chunks/X3cm3iuQ.js","_app/immutable/chunks/CwFfa-KW.js","_app/immutable/chunks/BMdiElij.js","_app/immutable/chunks/BC7-pRYh.js","_app/immutable/chunks/CXnXlaW0.js","_app/immutable/chunks/u0al_n1k.js","_app/immutable/chunks/CbSzZekf.js"];
export const stylesheets = ["_app/immutable/assets/0.8Wd_UEVZ.css"];
export const fonts = [];
