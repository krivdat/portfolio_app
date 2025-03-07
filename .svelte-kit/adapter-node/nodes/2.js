

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.D71AQpyo.js","_app/immutable/chunks/sHUU7htf.js","_app/immutable/chunks/X3cm3iuQ.js","_app/immutable/chunks/CwFfa-KW.js"];
export const stylesheets = [];
export const fonts = [];
