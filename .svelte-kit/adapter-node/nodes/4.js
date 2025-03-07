import * as server from '../entries/pages/assets/_assetId_/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/assets/_assetId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/assets/[assetId]/+page.server.js";
export const imports = ["_app/immutable/nodes/4.DKvTzveQ.js","_app/immutable/chunks/sHUU7htf.js","_app/immutable/chunks/X3cm3iuQ.js","_app/immutable/chunks/CwFfa-KW.js","_app/immutable/chunks/Cq2e60h3.js","_app/immutable/chunks/BirUzlQM.js","_app/immutable/chunks/CXnXlaW0.js","_app/immutable/chunks/u0al_n1k.js","_app/immutable/chunks/-GocX9d7.js","_app/immutable/chunks/AHqh6sfL.js","_app/immutable/chunks/CbSzZekf.js","_app/immutable/chunks/bKFRba8u.js"];
export const stylesheets = [];
export const fonts = [];
